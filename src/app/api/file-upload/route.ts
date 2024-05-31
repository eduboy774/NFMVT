import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join, basename } from 'path';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import getDb from '../../database/db';
import { CREATE_CASE_FILE_IF_NOT_EXISTS, CREATE_ARP_TABLE_IF_NOT_EXIST, CREATE_HOSTS_TABLE_IF_NOT_EXIST, CREATE_SSDP_TABLE_IF_NOT_EXIST } from '../../database/schema';

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
  return {
    http: `${tsharkPath} -r "${uploadPath}" -Y "http"`,
    httpHeaders: `${tsharkPath} -r "${uploadPath}" -Y "http" -T fields -e ip.src -e ip.dst -e http.host -e http.request.method -e http.request.uri -e http.user_agent -e http.referer -e http.response.code -e http.content_type`,
    ssdp: `${tsharkPath} -r "${uploadPath}" -Y "udp.port == 1900"`,
    openPorts: `${tsharkPath} -r "${uploadPath}" -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -T fields -e ip.src -e tcp.dstport -e tcp.analysis.initial_rtt -e tcp.window_size_value -e tcp.options.mss`,
    connections: `${tsharkPath} -r "${uploadPath}" -qz conv,ip`,
    dnsSmbLdapServers: `${tsharkPath} -r "${uploadPath}" -Y "dns || dhcp || ldap" -T fields -e frame.number -e frame.time -e ip.src -e ip.dst -e dns -e dhcp -e ldap`,
    arp: `${tsharkPath} -r "${uploadPath}" -Y "arp" -T fields -e arp.src.hw_mac -e arp.src.proto_ipv4 -e arp.dst.hw_mac -e arp.dst.proto_ipv4`,
    hosts: `${tsharkPath} -r "${uploadPath}" -Y "dns or smb or nbns" -T fields -e ip.src -e eth.src -e eth.src_resolved -e ip.dst -e eth.dst -e eth.dst_resolved"`,
    httpEverything: `${tsharkPath} -r "${uploadPath}" -Y "http" -T fields -e frame.number -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e http.request.method -e http.host -e http.user_agent -e http.referer -e http.response.code -e http.content_type -e http.cookie -e http.request.uri -e http.server -e http.content_length -e http.transfer_encoding -e http.cache_control -e http.authorization -e http.location -e http.connection`
  };
}

async function executeTsharkCommand(name, command, case_uuid) {
  return new Promise((resolve, reject) => {
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command "${name}": ${error}`);
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
            await handleSsdpData(stdout, case_uuid);
            break;
          // Add more cases for other tshark commands if needed
          default:
            console.log(`No handler defined for command "${name}"`);
        }
        resolve(true);
      } catch (err) {
        console.error(`Error handling data for command "${name}": ${err}`);
        reject(err);
      }
    });
  });
}

async function handleArpData(stdout: string, case_uuid: string) {
  console.log(`${stdout}\n`);
  const pattern = /\S+/g;
  const matches = stdout.match(pattern);

  if (!matches) {
    console.error('No matches found.');
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
  console.log('ARP data successfully inserted into the database!');
}

async function handleHostsData(stdout: string, case_uuid: string) {
  const pattern = /\S+/g;
  const matches = stdout.match(pattern);

  if (!matches) {
    console.error('No matches found.');
    return;
  }

  const db = await getDb();
  await db.run(CREATE_HOSTS_TABLE_IF_NOT_EXIST);
  await db.run('BEGIN TRANSACTION');

  const insertStmt = await db.prepare(
    'INSERT INTO hosts (host_uuid, host_source_ip, host_source_eth_mac, host_source_eth_resolved, host_destination_ip, host_destination_eth_mac, host_destination_eth_resolved, case_uuid) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (let i = 0; i < matches.length; i += 6) {
    const host_uuid = uuidv4();
    const ipSrc = matches[i];
    const ethSrc = matches[i + 1];
    const ethSrcResolved = matches[i + 2];
    const ipDst = matches[i + 3];
    const ethDst = matches[i + 4];
    const ethDstResolved = matches[i + 5];

    await insertStmt.run(
      host_uuid, ipSrc, ethSrc, ethSrcResolved, ipDst, ethDst, ethDstResolved, case_uuid
    );
  }
  await insertStmt.finalize();
  await db.run('COMMIT TRANSACTION');
  console.log('Hosts data successfully inserted into the database!');
}

async function handleSsdpData(stdout: string, case_uuid: string) {
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
  console.log('SSDP data successfully inserted into the database!');
}

export async function POST(request) {
  const data = await request.formData();
  const case_uuid = data.get('case_uuid');
  const file = data.get('file');

  if (!file) {
    console.log(`Error uploading file`);

    return NextResponse.json({ success: false, message: 'Error uploading file' });
  }

  try {
    const { md5Hash, uploadPath } = await uploadFileToServer(file, case_uuid);
    await handleFileUpload(file, case_uuid, md5Hash, uploadPath);
    await executeTsharkCommands(uploadPath, case_uuid);

    console.log('Processing completed successfully!');
    return NextResponse.json({ success: true, message: 'File uploaded and processed successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ success: false, message: 'Error processing file' });
  }
}
