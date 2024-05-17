import {writeFile} from 'fs/promises';
import {NextRequest, NextResponse} from 'next/server';
import {join, basename} from 'path';
import {createHash} from 'crypto';
const { v4: uuidv4 } = require('uuid');
import {exec} from 'child_process';
import getDb from '../../database/db'
import {CREATE_HOSTS_TABLE_IF_NOT_EXIST, CREATE_SSDP_TABLE_IF_NOT_EXIST} from '../../database/schema';


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
      // if (name == 'openPorts') {
      //   console.log(`${stdout}\n`);
      // }
      // if (name == 'connections') {
      //   console.log(`${stdout}\n`);
      // }
      // if (name == 'dnsSmbLdapServers') {
      //   console.log(`${stdout}\n`);
      // }
      // if (name == 'arp') {
      //   console.log(`${stdout}\n`);
      // }
      // if (name == 'hosts') {
      //   console.log(`${stdout}\n`);
      // }
      // if (name == 'httpEverything') {
      //   console.log(`${stdout}\n`);
      // }
      
      // WORKING
      if (name === 'hosts') {
        console.log(stdout);

        // Define the regular expression pattern to match each field
        const pattern = /\S+/g;

        // Extract all matches using the regular expression
        const matches = stdout.match(pattern);

        // Ensure matches are found
        if (!matches) {
          console.error('No matches found.');
        } else {
          // create the ssdp table if it doesn't already exist
          const db = await getDb();
          await db.run(CREATE_HOSTS_TABLE_IF_NOT_EXIST);
          
          const host_uuid = uuidv4();
          
          // Iterate over each match and map it to a variable
          for (let i = 0; i < matches.length; i += 6) {
            // Assign values to variables
            const ipSrc = matches[i];
            const ethSrc = matches[i + 1];
            const ethSrcResolved = matches[i + 2];
            const ipDst = matches[i + 3];
            const ethDst = matches[i + 4];
            const ethDstResolved = matches[i + 5];
            
            // insert the extracted data into the hosts table
            await db.run('INSERT INTO hosts(host_uuid, host_source_ip, host_source_eth_mac, host_source_eth_resolved, host_destination_ip, host_destination_eth_mac, host_destination_eth_resolved, case_uuid) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?)', [host_uuid, ipSrc, ethSrc, ethSrcResolved, ipDst, ethDst, ethDstResolved, case_uuid]);

          }

          console.log('Hosts data successfully inserted into the database!');
        }
      }

      if (name === 'ssdp') {
        const stdoutString = stdout.replace(/^\s+|\s+$/g, ''); // remove leading and trailing whitespace
        const lines = stdoutString.split('\n');

        const ssdp_request_uuid = uuidv4();

         // create the ssdp table if it doesn't already exist
         const db = await getDb();
         await db.run(CREATE_SSDP_TABLE_IF_NOT_EXIST);
    
        for (const line of lines) {
          const fields = line.match(/(\S+)/g); // extract all non-whitespace sequences
          if (fields?.length >= 9) {
            const packetNumber = fields[0];
            const timeElapsed = fields[1];
            const sourceIp = fields[2];
            const destinationIp = fields[4];
            const protocol = fields[5];
            const packetLength = fields[6];
            const httpMethod = fields[7];
            const compatibility = fields[8];
            const httpRequestTarget = fields[9];
            
            // insert the extracted data into the ssdp table
            await db.run(
              'INSERT INTO ssdp(ssdp_request_uuid, ssdp_request_source_ip, ssdp_request_destination_ip, ssdp_request_protocol, ssdp_request_method, ssdp_request_uri, ssdp_request_status_code, case_uuid) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
              [ssdp_request_uuid, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, case_uuid]);
          }
        }

        // close the database connection
        // await db.close();
        console.log('SSDP successfully inserted into the database!');
      }

    });
  });

  
  return NextResponse.json({success: true});
}




