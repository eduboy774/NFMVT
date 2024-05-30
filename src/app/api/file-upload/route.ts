import {writeFile} from 'fs/promises';
import {NextRequest, NextResponse} from 'next/server';
import {join, basename} from 'path';
import {createHash} from 'crypto';
const { v4: uuidv4 } = require('uuid');
import {exec} from 'child_process';
import getDb, { closeDb } from '../../database/db'
const os = require('os');
import {CREATE_ARP_TABLE_IF_NOT_EXIST, CREATE_HOSTS_TABLE_IF_NOT_EXIST, CREATE_SSDP_TABLE_IF_NOT_EXIST,CREATE_HTTP_HEADERS_TABLE_IF_NOT_EXIST} from '../../database/schema';

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
      // if (name == 'openPorts') {
      //   console.log(`${stdout}\n`);
      // }

      // if (name === 'httpEverything') {
      //   console.log(`${stdout}\n`);
      // }

      // if (name === 'httpHeaders') {
      //   console.log(`${stdout}\n`);
      //
      //   // Split the output into lines
      //   const lines = stdout.trim().split('\n');
      //
      //   // Initialize the database connection
      //   let db;
      //   let insertStmt;
      //   let dbClosed = false; // flag to check if db is closed
      //   try {
      //     // Create the table if it doesn't already exist
      //     db = await getDb();
      //     await db.run(CREATE_HTTP_HEADERS_TABLE_IF_NOT_EXIST);
      //
      //     // Start a transaction to improve performance
      //     await db.run('BEGIN TRANSACTION');
      //
      //     // Prepare the SQL statement for insertion
      //     insertStmt = await db.prepare(
      //       'INSERT INTO http_headers (http_uuid, source_ip, destination_ip, method, uri, user_agent, referer, status_code, content_type, case_uuid) ' +
      //       'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      //     );
      //
      //     // Regular expression to parse each line
      //     const regex = /^(\S+)\s+(\S+)\s+(\S+)\s+(.+?)(?:\s+(\d{3})\s+(\S+))?$/;
      //
      //     // Iterate over each line and extract data
      //     for (const line of lines) {
      //       const match = line.match(regex);
      //       if (match) {
      //         const http_uuid = uuidv4();
      //         const source_ip = match[1];
      //         const destination_ip = match[2];
      //         const method = match[4] || null;
      //         const uri = match[5] || null;
      //         const user_agent = match[6] || null;
      //         const referer = match[7] || null;
      //         const status_code = match[8] || null;
      //         const content_type = match[9] || null;
      //
      //         // Insert the extracted data into the http_headers table using the prepared statement
      //         await insertStmt.run(
      //           http_uuid, source_ip, destination_ip, method, uri, user_agent, referer, status_code, content_type, case_uuid
      //         );
      //       }
      //     }
      //
      //     // Commit the transaction
      //     await db.run('COMMIT TRANSACTION');
      //     console.log('HTTP headers data successfully inserted into the database!');
      //   } catch (error) {
      //     // Roll back the transaction in case of an error
      //     if (db) await db.run('ROLLBACK TRANSACTION');
      //     console.error('Error inserting HTTP headers data into the database:', error);
      //   } finally {
      //     // Ensure the prepared statement is finalized and the database connection is closed
      //     if (insertStmt) {
      //       try {
      //         await insertStmt.finalize();
      //       } catch (stmtError) {
      //         console.error('Error finalizing the statement:', stmtError);
      //       }
      //     }
      //     if (db && !dbClosed) {
      //       try {
      //         await db.close();
      //         dbClosed = true;
      //       } catch (closeError) {
      //         console.error('Error closing the database:', closeError);
      //       }
      //     }
      //   }
      // }

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
          } finally {
            // Ensure the prepared statement is finalized and the database connection is closed
            if (insertStmt) {
              try {
                await insertStmt.finalize();
              } catch (stmtError) {
                console.error('Error finalizing the statement:', stmtError);
              }
            }
            if (db) {
              try {
                await db.close();
              } catch (closeError) {
                console.error('Error closing the database:', closeError);
              }
            }
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
          } finally {
            // Ensure the prepared statement is finalized and the database connection is closed
            if (insertStmt) {
              try {
                await insertStmt.finalize();
              } catch (stmtError) {
                console.error('Error finalizing the statement:', stmtError);
              }
            }
            if (db) {
              try {
                await db.close();
              } catch (closeError) {
                console.error('Error closing the database:', closeError);
              }
            }
          }
        }
      }

      // if (name === 'ssdp') {
      //   const db = await getDb();

      //   // const stdoutString = stdout.trim(); // remove leading and trailing whitespace
      //   // const lines = stdoutString.split('\n');
      //   const lines = stdout.split('\n');

      //   // Create the SSDP table if it doesn't already exist
      //   await db.run(CREATE_SSDP_TABLE_NOT_EXIST);


      //   // Iterate through the lines and insert the data
      //   for (const line of lines) {
      //     const fields = line.split(/\s+/); // split by whitespace
      //     if (fields.length >= 10) {

      //   lines.forEach(async (line) => {
      //     const fields = line.match(/(\S+)/g); // extract all non-whitespace sequences
      //     if (fields?.length >= 9) {
      //       const ssdp_uuid = uuidv4();
      //       const packetNumber = fields[0];
      //       const timeElapsed = fields[1];
      //       const sourceIp = fields[2];
      //       const destinationIp = fields[4];
      //       const protocol = fields[5];
      //       const packetLength = fields[6];
      //       const httpMethod = fields[7];
      //       const compatibility = fields[8];
      //       const httpRequestTarget = fields[9];

      //       // insert the extracted data into the ssdp table
      //       await db.run('INSERT INTO ssdp(ssdp_uuid,case_uuid,packetNumber, timeElapsed, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, httpRequestTarget) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?)', [ssdp_uuid,case_uuid,packetNumber, timeElapsed, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, httpRequestTarget]);


      //     }
      //   });

      //   console.log('Data successfully inserted into the database!');

      //   }
      //   await db.close();
      //   }


      // }
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
              await insertStmt.run(
                ssdp_uuid,
                case_uuid,
                packetNumber,
                timeElapsed,
                sourceIp,
                destinationIp,
                protocol,
                packetLength,
                httpMethod,
                compatibility,
                httpRequestTarget
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
        } finally {
          // Ensure the prepared statement is finalized and the database connection is closed
          if (insertStmt) {
            try {
              await insertStmt.finalize();
            } catch (stmtError) {
              console.error('Error finalizing the statement:', stmtError);
            }
          }
          if (db) {
            try {
              await db.close();
            } catch (closeError) {
              console.error('Error closing the database:', closeError);
            }
          }
        }
      }

    });
  });

  return NextResponse.json({success: true});
}
