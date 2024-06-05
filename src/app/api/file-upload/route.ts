import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join, basename } from 'path';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import getDb from '../../database/db';
import { createLogger, transports, format } from 'winston';
import {
  CREATE_CASE_FILE_IF_NOT_EXISTS,
  CREATE_HTTP_REQUESTS_TABLE_IF_NOT_EXISTS,
  CREATE_ARP_TABLE_IF_NOT_EXIST,
  CREATE_HOSTS_TABLE_IF_NOT_EXIST,
  CREATE_SSDP_TABLE_IF_NOT_EXIST,
  CREATE_CONNECTIONS_TABLE_IF_NOT_EXISTS,
  CREATE_OPEN_PORTS_TABLE_IF_NOT_EXIST,
  CREATE_DNS_SMB_LDAP_SERVERS_TABLE_IF_NOT_EXIST,
  CREATE_HTTP_EVERYTHING_TABLE_IF_NOT_EXIST,
  CREATE_HTTP_HEADERS_TABLE_IF_NOT_EXIST
} from '../../database/schema';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' })
  ]
});

async function uploadFileToServer(file, case_uuid) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const md5Hash = createHash('md5').update(buffer).digest('hex');
  const uploadPath = join(process.cwd(), 'public', 'uploads', basename(file.name));

  await writeFile(uploadPath, buffer);

  return { md5Hash, uploadPath };
}

async function handleFileUpload(file, case_uuid, md5Hash, uploadPath) {
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const fileExtension = file.name.split('.').pop();
  const db = await getDb();

  await db.run(CREATE_CASE_FILE_IF_NOT_EXISTS);

  try {
    const existingFile = await db.get('SELECT * FROM case_files WHERE case_uuid = ?', case_uuid);

    if (existingFile) {
      throw new Error('A file already exists for this case');
    } else {
      await db.run(
        'INSERT INTO case_files (case_file_uuid, case_uuid, case_file_name, case_file_size, case_file_type, case_file_extension, case_file_md5_hash, case_file_upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), case_uuid, file.name, `${fileSizeMB} MB`, file.type, fileExtension, md5Hash, new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })]
      );
    }
  } catch (error) {
    return { success: false, message: error.message }; // Return error message to user
  }

  return { success: true, message: 'File uploaded successfully' };
}

async function executeTsharkCommands(uploadPath, case_uuid) {
  const os = require('os');
  const tsharkCommandExecutablePath = getTsharkCommandPath(os.platform());
  const tsharkCommands = getTsharkCommands(uploadPath);

  const commands = Object.entries(tsharkCommands);

  for (const [name, command] of commands) {
    await executeTsharkCommand(name, command, case_uuid);
  }

  return true;
}

function getTsharkCommandPath(platform) {
  switch (platform) {
    case 'win32':
      return `"C:\\Program Files\\Wireshark\\tshark.exe"`;
    case 'darwin':
      return `"/opt/homebrew/bin/tshark"`;
    case 'linux':
      return `"/usr/bin/tshark"`;
    default:
      throw new Error('Unsupported OS');
  }
}

function getTsharkCommands(uploadPath) {
  const tsharkPath = getTsharkCommandPath(process.platform);
  // Define base command with common arguments
  const baseCommand = `${tsharkPath} -r "${uploadPath}"`;

  return {
    // http: Use base command with http filter
    http: `${baseCommand} -Y "http"`,
    // Connections: Use -qz for capture filter output
    connections: `${baseCommand} -qz conv,ip`,
    // httpRequests: Use base command with http filter and -O http for HTTP dissector output
    httpRequests: `${baseCommand} -Y "http.request or http.response" -O http`,
    // httpHeaders: Similar to httpRequests but with additional fields for detailed headers
    httpHeaders: `${baseCommand} -Y "http" -T fields -e ip.src -e ip.dst -e http.host -e http.request.method -e http.request.uri -e http.user_agent -e http.referer -e http.response.code -e http.content_type`,
    // ssdp: Use base command with UDP port 1900 filter
    ssdp: `${baseCommand} -Y "udp.port == 1900"`,
    // openPorts: Use base command with SYN flag filter and capture specific fields
    openPorts: `${baseCommand} -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -T fields -e ip.src -e tcp.dstport -e tcp.analysis.initial_rtt -e tcp.window_size_value -e tcp.options.mss`,
    // dnsSmbLdapServers: Use base command with specific protocol filters and capture fields
    dnsSmbLdapServers: `${baseCommand} -Y "dns || dhcp || ldap" -T fields -e frame.number -e frame.time -e ip.src -e ip.dst -e dns -e dhcp -e ldap`,
    // arp: Use base command with ARP filter and capture specific fields
    arp: `${baseCommand} -Y "arp" -T fields -e arp.src.hw_mac -e arp.src.proto_ipv4 -e arp.dst.hw_mac -e arp.dst.proto_ipv4`,
    // hosts: Use base command with -qz for capture filter output for hosts
    hosts: `${baseCommand} -qz hosts`,
    // httpEverything: Combine base command with http filter, capture all available fields
    httpEverything: `${baseCommand} -Y "http" -T fields -e frame.number -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e http.request.method -e http.host -e http.user_agent -e http.referer -e http.response.code -e http.content_type -e http.cookie -e http.request.uri -e http.server -e http.content_length -e http.transfer_encoding -e http.cache_control -e http.authorization -e http.location -e http.connection`
  };
}

async function executeTsharkCommand(name, command, case_uuid) {
  return new Promise((resolve, reject) => {
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error executing command "${name}": ${error}`);
        reject(error);
      }

      try {
        switch (name) {
          case 'arp':
            await handleArpData(stdout, case_uuid);
            break;
          case 'hosts':
            await handleHostsData(stdout, case_uuid);
            break;
          case 'ssdp':
            await handleSSDPData(stdout, case_uuid);
            break;
          case 'connections':
            await handleConnectionsData(stdout, case_uuid);
            break;
          case 'httpRequests':
            await handleHTTPRequestsData(stdout, case_uuid);
            break;
          case 'httpHeaders':
            await handleHTTPHeadersData(stdout, case_uuid);
            break;
          case 'openPorts':
            await handleOpenPortsData(stdout, case_uuid);
            break;
          case 'dnsSmbLdapServers':
            await handleDnsSmbLdapServersData(stdout, case_uuid);
            break;
          case 'httpEverything':
            await handleHTTPEverythingData(stdout, case_uuid);
            break;
          default:
            logger.info(`No handler defined for command "${name}"`);
        }
        resolve(true);
      } catch (err) {
        logger.error(`Error handling data for command "${name}": ${err}`);
        reject(err);
      }
    });
  });
}

async function handleArpData(stdout: string, case_uuid: string) {
  const pattern = /\S+/g;
  const matches = stdout.match(pattern);

  if (!matches) {
    logger.error('No ARP data found.');
    return;
  }

  const db = await getDb();
  await db.run(CREATE_ARP_TABLE_IF_NOT_EXIST);
  await db.run('BEGIN TRANSACTION');

  const insertStmt = await db.prepare(
    'INSERT INTO arp (arp_uuid, arp_src_hw_mac, arp_src_proto_ipv4, arp_dst_hw_mac, arp_dst_proto_ipv4, case_uuid) ' +
    'VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (let i = 0; i < matches.length; i += 4) {
    const arp_uuid = uuidv4();
    const arpSrcHwMac = matches[i];
    const arpSrcProtoIpv4 = matches[i + 1];
    const arpDstHwMac = matches[i + 2];
    const arpDstProtoIpv4 = matches[i + 3];

    await insertStmt.run(
      arp_uuid, arpSrcHwMac, arpSrcProtoIpv4, arpDstHwMac, arpDstProtoIpv4, case_uuid
    );
  }
  await insertStmt.finalize();
  await db.run('COMMIT TRANSACTION');
  logger.info('ARP data successfully inserted into the database!');
}

async function handleHostsData(stdout: string, case_uuid: string) {
  const lines = stdout.trim().split('\n');

  if (!lines || lines.length === 0) {
    logger.error('No hosts data found.');
    return;
  }

  const db = await getDb();
  await db.run(CREATE_HOSTS_TABLE_IF_NOT_EXIST);
  await db.run('BEGIN TRANSACTION');

  const insertStmt = await db.prepare(
    'INSERT INTO hosts (host_uuid, ip_address, resolved_name, case_uuid) VALUES (?, ?, ?, ?)'
  );

  // IPv4 and IPv6 regex patterns
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Pattern = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|::(?:[a-fA-F0-9]{1,4}:){0,6}[a-fA-F0-9]{1,4}$/;

  for (const line of lines) {
    // Skip comment lines or empty lines
    if (line.startsWith('#') || line.trim() === '') {
      continue;
    }

    const fields = line.trim().split(/\s+/); // Split line by whitespace

    // Validate that there are exactly two fields: IP address and resolved name
    if (fields.length !== 2) {
      console.warn(`Skipping invalid line: ${line}`);
      continue;
    }

    const [ip_address, resolved_name] = fields;

    // Validate IP address format (both IPv4 and IPv6)
    if (!ipv4Pattern.test(ip_address) && !ipv6Pattern.test(ip_address)) {
      console.warn(`Invalid IP address found: ${ip_address}`);
      continue;
    }

    const host_uuid = uuidv4();

    await insertStmt.run(
      host_uuid, ip_address, resolved_name, case_uuid
    );
  }

  await insertStmt.finalize();
  await db.run('COMMIT TRANSACTION');
  logger.info('Hosts data successfully inserted into the database!');
}

async function handleSSDPData(stdout: string, case_uuid: string) {
  const lines = stdout.trim().split('\n');

  const db = await getDb();
  await db.run(CREATE_SSDP_TABLE_IF_NOT_EXIST);
  await db.run('BEGIN TRANSACTION');

  const insertStmt = await db.prepare(
    'INSERT INTO ssdp(ssdp_uuid, case_uuid, packetNumber, timeElapsed, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, httpRequestTarget) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const fieldRegex = /(\S+)/g;

  for (const line of lines) {
    const fields = line.match(fieldRegex);
    if (fields?.length >= 10) {
      const ssdp_uuid = uuidv4();
      const packetNumber = fields[0];
      const timeElapsed = fields[1];
      const sourceIp = fields[2];
      const destinationIp = fields[4];
      const protocol = fields[5];
      const packetLength = fields[6];
      const httpMethod = fields[7];
      const compatibility = fields[8];
      const httpRequestTarget = fields[9];

      await insertStmt.run(
        ssdp_uuid, case_uuid, packetNumber, timeElapsed, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, httpRequestTarget
      );
    }
  }
  await insertStmt.finalize();
  await db.run('COMMIT TRANSACTION');
  logger.info('SSDP data successfully inserted into the database!');
}

async function handleHTTPRequestsData(stdout: string, case_uuid: string) {
  // Split the output into lines
  const lines = stdout.trim().split('\n');

  const framePattern = /^Frame (\d+):/;
  const macPattern = /^Ethernet II, Src: ([\da-f:]+) \(.*\), Dst: ([\da-f:]+) \(.*\)$/;
  const ipPattern = /^Internet Protocol Version 4, Src: ([\d.]+), Dst: ([\d.]+)$/;
  const portPattern = /^Transmission Control Protocol, Src Port: (\d+), Dst Port: (\d+),/;
  const requestPattern = /^\s+(\w+) (\/.*) HTTP\/(\d+\.\d+)\r\n$/;
  const hostPattern = /^\s+Host: (.+)\r\n$/;
  const userAgentPattern = /^\s+User-Agent: (.+)\r\n$/;
  const fullUriPattern = /^\s+\[Full request URI: (.+)\]$/;
  const responsePattern = /^\s+HTTP\/(\d+\.\d+) (\d+) (.*)\r\n$/;
  const serverPattern = /^\s+Server: (.+)\r\n$/;
  const contentTypePattern = /^\s+Content-type: (.+)\r\n$/;
  const contentLengthPattern = /^\s+Content-Length: (\d+)\r\n$/;
  const lastModifiedPattern = /^\s+Last-Modified: (.+)\r\n$/;

  // Initialize variables to hold extracted data
  let frameNumber, srcMac, dstMac, srcIp, dstIp, srcPort, dstPort, method, uri, version, host, userAgent, fullRequestUri;
  let responseVersion, statusCode, responsePhrase, server, contentType, contentLength, lastModified, timeSinceRequest, requestFrame;

  const db = await getDb();
  await db.run(CREATE_HTTP_REQUESTS_TABLE_IF_NOT_EXISTS);
  await db.run('BEGIN TRANSACTION');

  const insertStmt = await db.prepare(
    'INSERT INTO http_requests (http_uuid, frame_number, src_mac, dst_mac, src_ip, dst_ip, src_port, dst_port, method, uri, request_version, host, user_agent, full_request_uri, response_version, status_code, response_phrase, server, content_type, content_length, last_modified, time_since_request, request_frame, case_uuid) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const insertData = async () => {
    if (frameNumber && srcMac && dstMac && srcIp && dstIp && srcPort && dstPort && (method || statusCode)) {
      const http_uuid = uuidv4();
      await insertStmt.run(
        http_uuid, frameNumber, srcMac, dstMac, srcIp, dstIp, srcPort, dstPort, method, uri, version, host, userAgent, fullRequestUri, responseVersion, statusCode, responsePhrase, server, contentType, contentLength, lastModified, timeSinceRequest, requestFrame, case_uuid
      );

      // Reset variables after inserting
      frameNumber = srcMac = dstMac = srcIp = dstIp = srcPort = dstPort = method = uri = version = host = userAgent = fullRequestUri = responseVersion = statusCode = responsePhrase = server = contentType = contentLength = lastModified = timeSinceRequest = requestFrame = undefined;
    }
  };

  for (const line of lines) {
    if (framePattern.test(line)) {
      await insertData(); // Insert data for the previous frame before starting a new one
      frameNumber = line.match(framePattern)[1];
    } else if (macPattern.test(line)) {
      [, srcMac, dstMac] = line.match(macPattern);
    } else if (ipPattern.test(line)) {
      [, srcIp, dstIp] = line.match(ipPattern);
    } else if (portPattern.test(line)) {
      [, srcPort, dstPort] = line.match(portPattern);
    } else if (requestPattern.test(line)) {
      [, method, uri, version] = line.match(requestPattern);
    } else if (hostPattern.test(line)) {
      host = line.match(hostPattern)[1];
    } else if (userAgentPattern.test(line)) {
      userAgent = line.match(userAgentPattern)[1];
    } else if (fullUriPattern.test(line)) {
      fullRequestUri = line.match(fullUriPattern)[1];
    } else if (responsePattern.test(line)) {
      [, responseVersion, statusCode, responsePhrase] = line.match(responsePattern);
    } else if (serverPattern.test(line)) {
      server = line.match(serverPattern)[1];
    } else if (contentTypePattern.test(line)) {
      contentType = line.match(contentTypePattern)[1];
    } else if (contentLengthPattern.test(line)) {
      contentLength = line.match(contentLengthPattern)[1];
    } else if (lastModifiedPattern.test(line)) {
      lastModified = line.match(lastModifiedPattern)[1];
    } else if (line.includes('[Time since request:')) {
      timeSinceRequest = parseFloat(line.split('[Time since request: ')[1].split(' ')[0]);
    } else if (line.includes('[Request in frame:')) {
      requestFrame = parseInt(line.split('[Request in frame: ')[1].split(']')[0]);
    }
  }

  await insertData(); // Insert data for the last frame
  await insertStmt.finalize();
  await db.run('COMMIT TRANSACTION');
  logger.info('HTTP data successfully inserted into the database!');
}

async function handleConnectionsData(stdout: string, case_uuid: string) {
  const lines = stdout.trim().split('\n');
  const dataStartIndex = lines.findIndex(line => line.startsWith('================================================================================')) + 2;

  const db = await getDb();
  await db.run(CREATE_CONNECTIONS_TABLE_IF_NOT_EXISTS);
  await db.run('BEGIN TRANSACTION');

  const insertStmt = await db.prepare(
    'INSERT INTO connections (connection_uuid, src_ip, dst_ip, frames_sent, bytes_sent, frames_received, bytes_received, total_frames, total_bytes, start_time, duration, case_uuid) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const columns = line.split(/\s+/);
      const connection_uuid = uuidv4();
      const src_ip = columns[0];
      const dst_ip = columns[2];
      const frames_sent = parseInt(columns[3]);
      const bytes_sent = columns[4];
      const frames_received = parseInt(columns[6]);
      const bytes_received = columns[7];
      const total_frames = parseInt(columns[9]);
      const total_bytes = columns[10];
      const start_time = parseFloat(columns[11]);
      const duration = parseFloat(columns[12]);

      await insertStmt.run(
        connection_uuid, src_ip, dst_ip, frames_sent, bytes_sent, frames_received, bytes_received, total_frames, total_bytes, start_time, duration, case_uuid
      );
    }
  }

  await insertStmt.finalize();
  await db.run('COMMIT TRANSACTION');
  logger.info('Conversations data successfully inserted into the database!');
}

async function handleHTTPHeadersData(stdout: string, case_uuid: string) {
  const lines = stdout.trim().split('\n');
  const db = await getDb();
  await db.run(CREATE_HTTP_HEADERS_TABLE_IF_NOT_EXIST);
  await db.run('BEGIN TRANSACTION');

  const insertStmt = await db.prepare(
    'INSERT INTO http_headers (http_header_uuid, src_ip, dst_ip, host, method, uri, user_agent, referer, response_code, content_type, case_uuid) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (const line of lines) {
    const fields = line.split('\t');
    if (fields.length === 10) {
      const http_header_uuid = uuidv4();
      const [src_ip, dst_ip, host, method, uri, user_agent, referer, response_code, content_type] = fields;
      await insertStmt.run(
        http_header_uuid, src_ip, dst_ip, host, method, uri, user_agent, referer, response_code, content_type, case_uuid
      );
    }
  }
  await insertStmt.finalize();
  await db.run('COMMIT TRANSACTION');
  logger.info('HTTP headers data successfully inserted into the database!');
}

async function handleOpenPortsData(stdout: string, case_uuid: string) {
  const lines = stdout.trim().split('\n');
  const db = await getDb();
  await db.run(CREATE_OPEN_PORTS_TABLE_IF_NOT_EXIST);
  await db.run('BEGIN TRANSACTION');

  const insertStmt = await db.prepare(
    'INSERT INTO open_ports (open_port_uuid, src_ip, dst_port, initial_rtt, window_size, mss, case_uuid) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  for (const line of lines) {
    const fields = line.split('\t');
    if (fields.length === 5) {
      const open_port_uuid = uuidv4();
      const [src_ip, dst_port, initial_rtt, window_size, mss] = fields;
      await insertStmt.run(
        open_port_uuid, src_ip, dst_port, initial_rtt, window_size, mss, case_uuid
      );
    }
  }
  await insertStmt.finalize();
  await db.run('COMMIT TRANSACTION');
  logger.info('Open ports data successfully inserted into the database!');
}

async function handleDnsSmbLdapServersData(stdout: string, case_uuid: string) {
  const lines = stdout.trim().split('\n');
  const db = await getDb();
  await db.run(CREATE_DNS_SMB_LDAP_SERVERS_TABLE_IF_NOT_EXIST);
  await db.run('BEGIN TRANSACTION');

  const insertStmt = await db.prepare(
    'INSERT INTO dns_smb_ldap_servers (server_uuid, frame_number, frame_time, src_ip, dst_ip, dns, dhcp, ldap, case_uuid) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (const line of lines) {
    const fields = line.split('\t');
    if (fields.length === 8) {
      const server_uuid = uuidv4();
      const [frame_number, frame_time, src_ip, dst_ip, dns, dhcp, ldap] = fields;
      await insertStmt.run(
        server_uuid, frame_number, frame_time, src_ip, dst_ip, dns, dhcp, ldap, case_uuid
      );
    }
  }
  await insertStmt.finalize();
  await db.run('COMMIT TRANSACTION');
  logger.info('DNS, SMB, LDAP servers data successfully inserted into the database!');
}

async function handleHTTPEverythingData(stdout: string, case_uuid: string) {
  const lines = stdout.trim().split('\n');
  const db = await getDb();

  // Combine table creation and transaction logic for efficiency
  try {
    await db.run(CREATE_HTTP_EVERYTHING_TABLE_IF_NOT_EXIST);
    await db.run('BEGIN TRANSACTION');
    const insertStmt = await db.prepare(`INSERT INTO http_everything (http_uuid, frame_number, src_ip, dst_ip, src_port, dst_port, method, host, user_agent, referer, response_code, content_type, cookie, uri, server, content_length, transfer_encoding, cache_control, authorization, location, connection, case_uuid)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    if(insertStmt) logger.info(`inserting http data in table, please wait`);

    for (const line of lines) {
      const fields = line.split('\t');
      if (fields.length === 21) {
        const httpEverythingData = {http_uuid: uuidv4(), frame_number: fields[0], src_ip: fields[1], dst_ip: fields[2], src_port: fields[3], dst_port: fields[4], method: fields[5], host: fields[6], user_agent: fields[7], referer: fields[8], response_code: fields[9], content_type: fields[10], cookie: fields[11], uri: fields[12], server: fields[13], content_length: fields[14], transfer_encoding: fields[15], cache_control: fields[16], authorization: fields[17], location: fields[18], connection: fields[19], case_uuid,};
        await insertStmt.run(httpEverythingData);
      } else {
        console.error(`Invalid HTTP Everything line format: ${line}`);
      }
    }

    await insertStmt.finalize();
    await db.run('COMMIT TRANSACTION');
    logger.info('HTTP everything data successfully inserted into the database!');
  } catch (error) {
    console.error('Error inserting HTTP Everything data:', error);
    await db.run('ROLLBACK TRANSACTION'); // Rollback on error
  }
}

export async function POST(request) {
  const data = await request.formData();
  const case_uuid = data.get('case_uuid');
  const file = data.get('file');

  if (!file) {
    logger.info(`Error uploading file`);

    return NextResponse.json({ success: false, message: 'Error uploading file' });
  }

  try {
    const { md5Hash, uploadPath } = await uploadFileToServer(file, case_uuid);
    await handleFileUpload(file, case_uuid, md5Hash, uploadPath);
    await executeTsharkCommands(uploadPath, case_uuid);

    logger.info('Processing completed successfully!');
    return NextResponse.json({ success: true, message: 'File uploaded and processed successfully' });
  } catch (error) {
    logger.error('Error processing file:', error);
    return NextResponse.json({ success: false, message: 'Error processing file' });
  }
}
