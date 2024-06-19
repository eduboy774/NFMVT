import {writeFile} from 'fs/promises';
import {NextRequest, NextResponse} from 'next/server';
import {join, basename} from 'path';
import {createHash} from 'crypto';
const { v4: uuidv4 } = require('uuid');
import {exec} from 'child_process';
import getDb, { closeDb } from '../../database/db'
const os = require('os');
import { CREATE_CASE_FILE_IF_NOT_EXISTS, CREATE_ARP_TABLE_IF_NOT_EXIST, CREATE_HOSTS_TABLE_IF_NOT_EXIST, CREATE_SSDP_TABLE_IF_NOT_EXIST,CREATE_HTTP_HEADERS_TABLE_IF_NOT_EXIST} from '../../database/schema';

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

  // Get file size in MB
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

  // Get file extension
  const fileExtension = file.name.split('.').pop();

  try {
    // Initialize the database connection
    const db = await getDb();

    // Create the case_files table if it doesn't exist
    await db.run(CREATE_CASE_FILE_IF_NOT_EXISTS);

    // Check if a file already exists for the given case
    const existingFile = await db.get('SELECT * FROM case_files WHERE case_uuid = ?', case_uuid);

    if (existingFile) {
      // If a file exists, update its details
      await db.run(
        'UPDATE case_files SET case_file_name = ?, case_file_size = ?, case_file_type = ?, case_file_extension = ?, case_file_md5_hash = ?, case_file_upload_date = ? WHERE case_uuid = ?',
        [file.name, `${fileSizeMB} MB`, file.type, fileExtension, md5Hash, new Date().toLocaleString('en-KE', {timeZone: 'Africa/Nairobi'}), case_uuid]
      );
    } else {
      // If no file exists, insert a new record
      await db.run(
        'INSERT INTO case_files (case_file_uuid, case_uuid, case_file_name, case_file_size, case_file_type, case_file_extension, case_file_md5_hash, case_file_upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), case_uuid, file.name, `${fileSizeMB} MB`, file.type, fileExtension, md5Hash, new Date().toLocaleString('en-KE', {timeZone: 'Africa/Nairobi'})]
      );
    }

    console.log('File details inserted into the database successfully!');
    return NextResponse.json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error inserting file details into the database:', error);
    return NextResponse.json({ success: false, message: 'Error inserting file details into the database' });
  }


  // Determine the operating system and set the tshark command executable path
  let tsharkCommandExecutablePath;
  switch (os.platform()) {
    case 'win32':
      tsharkCommandExecutablePath = `"C:\\Program Files\\Wireshark\\tshark.exe"`;
      break;
    case 'darwin':
      tsharkCommandExecutablePath = `"/opt/homebrew/bin/tshark"`;
      break;
    case 'linux':
      tsharkCommandExecutablePath = `"/usr/bin/tshark"`; // Adjust the path if needed
      break;
    default:
      throw new Error('Unsupported OS');
  }

  // Define the tshark commands based on the uploaded file path
  const tsharkCommands = {
    // httpHeaders: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http" -T fields -e http.host -e http.request.method -e http.request.uri -e http.user_agent -e http.referer -e http.response.code -e http.content_type`,
    http: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http"`,
    httpHeaders: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http" -T fields -e ip.src -e ip.dst -e http.host -e http.request.method -e http.request.uri -e http.user_agent -e http.referer -e http.response.code -e http.content_type`,
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

      // WORKING
      if (name === 'arp') {
        console.log(`${stdout}\n`);

        // Define the regular expression pattern to match each field
        const pattern = /\S+/g;

        // Extract all matches using the regular expression
        const matches = stdout.match(pattern);

        // Ensure matches are found
        if (!matches) {
          console.error('No matches found.');
        } else {
          let db;
          let insertStmt;
          try {
            // Create the ARP table if it doesn't already exist
            db = await getDb();
            await db.run(CREATE_ARP_TABLE_IF_NOT_EXIST);

            // Start a transaction to improve performance
            await db.run('BEGIN TRANSACTION');

            // Prepare the SQL statement for insertion
            insertStmt = await db.prepare(
              'INSERT INTO arp (arp_uuid, arp_src_hw_mac, arp_src_proto_ipv4, arp_dst_hw_mac, arp_dst_proto_ipv4, case_uuid) ' +
              'VALUES (?, ?, ?, ?, ?, ?)'
            );

            // Iterate over each match and map it to a variable
            for (let i = 0; i < matches.length; i += 4) {
              // Generate a new UUID for each row
              const arp_uuid = uuidv4();

              // Assign values to variables
              const arpSrcHwMac = matches[i];
              const arpSrcProtoIpv4 = matches[i + 1];
              const arpDstHwMac = matches[i + 2];
              const arpDstProtoIpv4 = matches[i + 3];

              // Insert the extracted data into the ARP table using the prepared statement
              await insertStmt.run(
                arp_uuid, arpSrcHwMac, arpSrcProtoIpv4, arpDstHwMac, arpDstProtoIpv4, case_uuid
              );
            }
            // Commit the transaction
            await db.run('COMMIT TRANSACTION');
            console.log('ARP data successfully inserted into the database!');
          } catch (error) {
            // Roll back the transaction in case of an error
            if (db) await db.run('ROLLBACK TRANSACTION');
            console.error('Error inserting ARP data into the database:', error);
          }
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
          let db;
          let insertStmt;
          try {
            // Create the hosts table if it doesn't already exist
            db = await getDb();
            await db.run(CREATE_HOSTS_TABLE_IF_NOT_EXIST);

            // Start a transaction to improve performance
            await db.run('BEGIN TRANSACTION');

            // Prepare the SQL statement for insertion
            insertStmt = await db.prepare(
              'INSERT INTO hosts (host_uuid, host_source_ip, host_source_eth_mac, host_source_eth_resolved, host_destination_ip, host_destination_eth_mac, host_destination_eth_resolved, case_uuid) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );

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

              // Insert the extracted data into the hosts table using the prepared statement
              await insertStmt.run(
                host_uuid, ipSrc, ethSrc, ethSrcResolved, ipDst, ethDst, ethDstResolved, case_uuid
              );
            }
            // Commit the transaction
            await db.run('COMMIT TRANSACTION');
            console.log('Hosts data successfully inserted into the database!');
          } catch (error) {
            // Roll back the transaction in case of an error
            if (db) await db.run('ROLLBACK TRANSACTION');
            console.error('Error inserting hosts data into the database:', error);
          }
        }
      }
      
      if (name === 'ssdp') {
        const lines = stdout.trim().split('\n');

        let db;
        let insertStmt;
        try {
          // Initialize the database connection
          db = await getDb();
          await db.run(CREATE_SSDP_TABLE_IF_NOT_EXIST);

          // Prepare the SQL statement for insertion
          insertStmt = await db.prepare(
            'INSERT INTO ssdp(ssdp_uuid, case_uuid, packetNumber, timeElapsed, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, httpRequestTarget) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
          );

          // Start a transaction to improve performance
          await db.run('BEGIN TRANSACTION');

          // Regular expression to match fields
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

              // Insert the extracted data into the ssdp table using the prepared statement
              await insertStmt.run(ssdp_uuid, case_uuid, packetNumber, timeElapsed, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, httpRequestTarget
              );
            }
          }
          // Commit the transaction
          await db.run('COMMIT TRANSACTION');
          console.log('SSDP data successfully inserted into the database!');
        } catch (error) {
          // Roll back the transaction in case of an error
          if (db) await db.run('ROLLBACK TRANSACTION');
          console.error('Error inserting SSDP data into the database:', error);
        }
      }
    });
  });

  return NextResponse.json({success: true});
}
