import {writeFile} from 'fs/promises';
import {NextRequest, NextResponse} from 'next/server';
import {join, basename} from 'path';
import {createHash} from 'crypto';
const { v4: uuidv4 } = require('uuid');
import {exec} from 'child_process';
import getDb from '../../database/db'
import {CREATE_HOSTS_TABLE_IF_NOT_EXIST} from '../../database/schema';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const case_uuid = data.get('case_uuid')
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    console.log(`Error uploading file`);
    return NextResponse.json({success: false});
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Calculate the MD5 hash of the file
  const md5Hash = createHash('md5').update(buffer).digest('hex');

  // Define the path to the public/uploads directory
  const uploadPath = join(process.cwd(), 'public', 'uploads', basename(file.name));

  // Write the file to the specified path
  await writeFile(uploadPath, buffer);

  console.log(`File uploaded successfully to: ${uploadPath}`);
  console.log(`MD5 hash of the file: ${md5Hash}`);

  const tsharkCommandExecutablePath = `"C:\\Program Files\\Wireshark\\tshark.exe"`;
  // const tsharkCommandExecutablePath = `"/opt/homebrew/bin/tshark"`;

  // Define the tshark commands based on the uploaded file path
  const tsharkCommands = {
    httpHeaders: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http" -T fields -e http.host -e http.request.method -e http.request.uri -e http.user_agent -e http.referer -e http.response.code -e http.content_type`,
    http: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http"`,
    ssdp: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "udp.port == 1900"`,
    openPorts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -T fields -e ip.src -e tcp.dstport -e tcp.analysis.initial_rtt -e tcp.window_size_value -e tcp.options.mss`,
    connections: `${tsharkCommandExecutablePath} -r "${uploadPath}" -qz conv,ip`,
    dnsSmbLdapServers: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "dns || dhcp || ldap" -T fields -e frame.number -e frame.time -e ip.src -e ip.dst -e dns -e dhcp -e ldap`,
    arp: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "arp" -T fields -e arp.src.hw_mac -e arp.src.proto_ipv4 -e arp.dst.hw_mac -e arp.dst.proto_ipv4`,
    hosts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "dns or smb or nbns" -T fields -e ip.src -e eth.src -e eth.src_resolved -e ip.dst -e eth.dst -e eth.dst_resolved"`,
    httpEverything: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http" -T fields -e frame.number -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e http.request.method -e http.host -e http.user_agent -e http.referer -e http.response.code -e http.content_type -e http.cookie -e http.request.uri -e http.server -e http.content_length -e http.transfer_encoding -e http.cache_control -e http.authorization -e http.location -e http.connection`
  };

// Execute the tshark commands
  Object.entries(tsharkCommands).forEach(([name, command]) => {
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command "${name}": ${error}`);
        return;
      }
      
      // if (name == 'httpHeaders') {
      //   console.log(`${stdout}\n`);
      // }
      // if (name == 'ssdp') {
      //   console.log(`${stdout}\n`);
      // }

      // if (name === 'connections') {
      //   console.log(`${stdout}\n`);
      //
      //   // Split the output into lines
      //   const lines = stdout.trim().split('\n');
      //
      //   const CREATE_CONNECTIONS_TABLE_IF_NOT_EXIST = `
      //     CREATE TABLE IF NOT EXISTS connections (
      //       connection_uuid TEXT PRIMARY KEY,
      //       source_ip TEXT,
      //       destination_ip TEXT,
      //       sent_packets INTEGER,
      //       sent_bytes TEXT,
      //       received_packets INTEGER,
      //       received_bytes TEXT,
      //       total_packets INTEGER,
      //       total_bytes TEXT,
      //       duration REAL,
      //       bandwidth REAL,
      //       case_uuid TEXT
      //     )
      //   `;
      //  
      //   // Create the connections table if it doesn't already exist
      //   const db = await getDb();
      //   await db.run(CREATE_CONNECTIONS_TABLE_IF_NOT_EXIST);
      //
      //   // Iterate over each line and parse the data
      //   for (const line of lines) {
      //     // Split the line by whitespace to get the fields
      //     const fields = line.split(/\s+/);
      //
      //     if (fields.length === 10) {
      //       // Generate a new UUID for each row
      //       const connection_uuid = uuidv4();
      //
      //       // Assign values to variables
      //       const sourceIp = fields[0];
      //       const destinationIp = fields[2];
      //       const sentPackets = parseInt(fields[3], 10);
      //       const sentBytes = fields[4];
      //       const receivedPackets = parseInt(fields[5], 10);
      //       const receivedBytes = fields[6];
      //       const totalPackets = parseInt(fields[7], 10);
      //       const totalBytes = fields[8];
      //       const duration = parseFloat(fields[9]);
      //       const bandwidth = parseFloat(fields[10]);
      //
      //       // Insert the extracted data into the connections table
      //       await db.run(
      //         'INSERT INTO connections (connection_uuid, source_ip, destination_ip, sent_packets, sent_bytes, received_packets, received_bytes, total_packets, total_bytes, duration, bandwidth, case_uuid) ' +
      //         'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      //         [connection_uuid, sourceIp, destinationIp, sentPackets, sentBytes, receivedPackets, receivedBytes, totalPackets, totalBytes, duration, bandwidth, case_uuid]
      //       );
      //     } else {
      //       console.error(`Unexpected number of fields (${fields.length}) in line: ${line}`);
      //     }
      //   }
      //
      //   console.log('Connection data successfully inserted into the database!');
      // }

      // if (name == 'dnsSmbLdapServers') {
      //   console.log(`${stdout}\n`);
      // }
      // if (name == 'httpEverything') {
      //   console.log(`${stdout}\n`);
      // }
      // if (name == 'openPorts') {
      //   console.log(`${stdout}\n`);
      // }

      
      
      // WORKING
      if (name == 'arp') {
        console.log(`${stdout}\n`);
        const CREATE_ARP_TABLE_IF_NOT_EXIST = `
        CREATE TABLE IF NOT EXISTS arp (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          arp_uuid TEXT NOT NULL,
          arp_src_hw_mac TEXT,
          arp_src_proto_ipv4 TEXT,
          arp_dst_hw_mac TEXT,
          arp_dst_proto_ipv4 TEXT,
          case_uuid TEXT
        )
      `;

        // Define the regular expression pattern to match each field
        const pattern = /\S+/g;

        // Extract all matches using the regular expression
        const matches = stdout.match(pattern);

        // Ensure matches are found
        if (!matches) {
          console.error('No matches found.');
        } else {
          // Create the ARP table if it doesn't already exist
          const db = await getDb();
          await db.run(CREATE_ARP_TABLE_IF_NOT_EXIST);

          // Iterate over each match and map it to a variable
          for (let i = 0; i < matches.length; i += 4) {
            // Generate a new UUID for each row
            const arp_uuid = uuidv4();

            // Assign values to variables
            const arpSrcHwMac = matches[i];
            const arpSrcProtoIpv4 = matches[i + 1];
            const arpDstHwMac = matches[i + 2];
            const arpDstProtoIpv4 = matches[i + 3];

            // Insert the extracted data into the ARP table
            await db.run(
              'INSERT INTO arp (arp_uuid, arp_src_hw_mac, arp_src_proto_ipv4, arp_dst_hw_mac, arp_dst_proto_ipv4, case_uuid) ' +
              'VALUES (?, ?, ?, ?, ?, ?)',
              [arp_uuid, arpSrcHwMac, arpSrcProtoIpv4, arpDstHwMac, arpDstProtoIpv4, case_uuid]
            );
          }

          console.log('ARP data successfully inserted into the database!');
        }

      }

      if (name === 'hosts') {
        // Define the regular expression pattern to match each field
        const pattern = /\S+/g;

        // Extract all matches using the regular expression
        const matches = stdout.match(pattern);

        // Ensure matches are found
        if (!matches) {
          console.error('No matches found.');
        } else {
          // create the hosts table if it doesn't already exist
          const db = await getDb();
          await db.run(CREATE_HOSTS_TABLE_IF_NOT_EXIST);

          // Iterate over each match and map it to a variable
          for (let i = 0; i < matches.length; i += 6) {
            // Generate a new UUID for each row
            const host_uuid = uuidv4();

            // Assign values to variables
            const ipSrc = matches[i];
            const ethSrc = matches[i + 1];
            const ethSrcResolved = matches[i + 2];
            const ipDst = matches[i + 3];
            const ethDst = matches[i + 4];
            const ethDstResolved = matches[i + 5];

            // insert the extracted data into the hosts table
            await db.run(
              'INSERT INTO hosts (host_uuid, host_source_ip, host_source_eth_mac, host_source_eth_resolved, host_destination_ip, host_destination_eth_mac, host_destination_eth_resolved, case_uuid) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [host_uuid, ipSrc, ethSrc, ethSrcResolved, ipDst, ethDst, ethDstResolved, case_uuid]
            );
          }

          console.log('Hosts data successfully inserted into the database!');
        }
      }

      if (name === 'ssdp') {
        // const stdoutString = stdout.trim(); // remove leading and trailing whitespace
        // const lines = stdoutString.split('\n');
        const lines = stdout.split('\n');

        // Create the SSDP table if it doesn't already exist
        const db = await getDb();
        await db.run(`
          CREATE TABLE IF NOT EXISTS ssdp (
            ssdp_request_uuid TEXT PRIMARY KEY,
            time_elapsed TEXT,
            source_ip TEXT,
            destination_ip TEXT,
            protocol TEXT,
            packet_length TEXT,
            http_method TEXT,
            compatibility TEXT,
            http_request_target TEXT,
            case_uuid TEXT
          )
        `);


        // Iterate through the lines and insert the data
        for (const line of lines) {
          const fields = line.split(/\s+/); // split by whitespace
          if (fields.length >= 10) {
            // Generate a new UUID for each row
            const ssdp_request_uuid = uuidv4();

            const timeElapsed = fields[1];
            const sourceIp = fields[2];
            const destinationIp = fields[4];
            const protocol = fields[5];
            const packetLength = fields[6];
            const httpMethod = fields[7];
            const compatibility = fields[8];
            const httpRequestTarget = fields[9];

            // Insert the extracted data into the SSDP table
            await db.run(
              'INSERT INTO ssdp (ssdp_request_uuid, time_elapsed, source_ip, destination_ip, protocol, packet_length, http_method, compatibility, http_request_target, case_uuid) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [ssdp_request_uuid, timeElapsed, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, httpRequestTarget, case_uuid]
            );
          }
        }

        // Close the database connection (uncomment if necessary)
        // await db.close();
        console.log('SSDP records successfully inserted into the database!');
      }
    });
  });

  
  return NextResponse.json({success: true});
}




