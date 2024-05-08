import {writeFile} from 'fs/promises';
import {NextRequest, NextResponse} from 'next/server';
import {join, basename} from 'path';
import {createHash} from 'crypto';
import {exec} from 'child_process';
import { v4 as uuidv4 } from 'uuid';


export async function POST(request: NextRequest) {
  const data = await request.formData();
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
  // Define the tshark commands based on the uploaded file path
  const tsharkCommands = {
    // httpHeaders: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http" -T fields -e http.host -e http.request.method -e http.request.uri -e http.user_agent -e http.referer -e http.response.code -e http.content_type`,
    // http: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http"`,
    ssdp: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "udp.port == 1900"`,
    // openPorts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -T fields -e ip.src -e tcp.dstport -e tcp.analysis.initial_rtt -e tcp.window_size_value -e tcp.options.mss`,
    // openPorts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -T fields -e ip.src -e tcp.dstport -e tcp.analysis.initial_rtt -e tcp.window_size_value -e tcp.options.mss | Sort-Object -Unique`,
    
    // connections: `${tsharkCommandExecutablePath} -r "${uploadPath}" -qz conv,ip`,
    // dnsSmbLdapServers: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "dns || dhcp || ldap" -T fields -e frame.number -e frame.time -e ip.src -e ip.dst -e dns -e dhcp -e ldap`,
    // arp: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "arp" -T fields -e arp.src.hw_mac -e arp.src.proto_ipv4 -e arp.dst.hw_mac -e arp.dst.proto_ipv4 | Sort-Object -Unique`,
    // arp: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "arp" -T fields -e arp.src.hw_mac -e arp.src.proto_ipv4 -e arp.dst.hw_mac -e arp.dst.proto_ipv4`,
    // hosts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "dns or smb or nbns" -T fields -e ip.src -e eth.src -e eth.src_resolved -e ip.dst -e eth.dst -e eth.dst_resolved | Sort-Object -Unique`,
    hosts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "dns or smb or nbns" -T fields -e ip.src -e eth.src -e eth.src_resolved -e ip.dst -e eth.dst -e eth.dst_resolved"`,
    // httpEverything: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http" -T fields -e frame.number -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e http.request.method -e http.host -e http.user_agent -e http.referer -e http.response.code -e http.content_type -e http.cookie -e http.request.uri -e http.server -e http.content_length -e http.transfer_encoding -e http.cache_control -e http.authorization -e http.location -e http.connection`
  };

  // Execute the tshark commands
  // Object.entries(tsharkCommands).forEach(([name, command]) => {
  //   // console.log(`Executing command "${name}": ${command}`);
  //
  //   exec(command, (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`Error executing command "${name}": ${error}`);
  //       return;
  //     }
  //     // Running command
  //     console.log(tsharkCommands)
  //    
  //     // Checking commands
  //     if (tsharkCommands.httpHeaders){
  //       const output = stdout;
  //       const entries = output.trim().split('\n\n');
  //       console.log(entries)
  //
  //       const mappedEntries = entries.map((entry) => {
  //         const lines = entry.split('\r\n');
  //         const [httpUserAgent, httpHost, httpMethod, httpVersion, httpReferer, httpUri] = lines[0].split('\t');
  //         const responseCode = parseInt(lines[1].trim());
  //         const contentType = lines[2].split(' ')[1];
  //
  //         return {
  //           http_header_id: uuidv4(), 
  //           http_host: httpUserAgent,
  //           http_method: httpHost,
  //           http_uri: httpMethod,
  //           http_user_agent: httpReferer,
  //           http_referer: null, // Not provided in the output
  //           http_response_code: responseCode,
  //           http_content_type: contentType,
  //           file_id: null // Not provided in the output
  //         };
  //       });
  //
  //       console.log(mappedEntries);
  //       console.log(`HTTP HEADERS\n${stdout}`);
  //     } 
  //     // if(tsharkCommands.http){
  //     //   console.log(`HTTP\n${stdout}`);
  //     // } 
  //     // if(tsharkCommands.ssdp) {
  //     //   console.log(`SSDP\n${stdout}`);
  //     // }
  //    
  //     // console.log(`Command output (${name}): ${stdout}`);
  //
  //     // 
  //   });
  // });


// Execute the tshark commands
  Object.entries(tsharkCommands).forEach(([name, command]) => {
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command "${name}": ${error}`);
        return;
      }

      // if (name === 'httpEverything') {
      //   const rows = stdout.trim().split('\n');
      //   const headerRow = rows.shift().split('\t');
      //   const fieldNames = headerRow.map((header) => header.trim());
      //
      //   const mappedRows = rows.map((row) => {
      //     const fields = row.split('\t');
      //     const frameNumber = fields[0];
      //     const srcIp = fields[1];
      //     const dstIp = fields[2];
      //     const srcPort = fields[3];
      //     const dstPort = fields[4];
      //     const requestMethod = fields[5];
      //     const requestUri = fields[6];
      //     const host = fields[7];
      //     const userAgent = fields[8];
      //     const referer = fields[9];
      //     const responseCode = fields[10];
      //     const contentType = fields[11];
      //     const contentLength = fields[12];
      //     const server = fields[13];
      //     const cookie = fields[14];
      //     const transferEncoding = fields[15];
      //     const cacheControl = fields[16];
      //     const authorization = fields[17];
      //     const location = fields[18];
      //     const connection = fields[19];
      //
      //     return {
      //       frameNumber,
      //       srcIp,
      //       dstIp,
      //       srcPort,
      //       dstPort,
      //       requestMethod,
      //       requestUri,
      //       host,
      //       userAgent,
      //       referer,
      //       responseCode,
      //       contentType,
      //       contentLength,
      //       server,
      //       cookie,
      //       transferEncoding,
      //       cacheControl,
      //       authorization,
      //       location,
      //       connection
      //     };
      //   });
      //
      //   console.log(mappedRows);
      // }


      // WORKING
      // if (name === 'hosts') {
      //   console.log(stdout);
      //
      //   // Define the regular expression pattern to match each field
      //   const pattern = /\S+/g;
      //
      //   // Extract all matches using the regular expression
      //   const matches = stdout.match(pattern);
      //
      //   // Ensure matches are found
      //   if (!matches) {
      //     console.error('No matches found.');
      //   } else {
      //     // Iterate over each match and map it to a variable
      //     for (let i = 0; i < matches.length; i += 6) {
      //       // Assign values to variables
      //       const ipSrc = matches[i];
      //       const ethSrc = matches[i + 1];
      //       const ethSrcResolved = matches[i + 2];
      //       const ipDst = matches[i + 3];
      //       const ethDst = matches[i + 4];
      //       const ethDstResolved = matches[i + 5];
      //
      //       // Log the variables to the console
      //       console.log('ipSrc:', ipSrc);
      //       console.log('ethSrc:', ethSrc);
      //       console.log('ethSrcResolved:', ethSrcResolved);
      //       console.log('ipDst:', ipDst);
      //       console.log('ethDst:', ethDst);
      //       console.log('ethDstResolved:', ethDstResolved);
      //     }
      //   }
      // }
      //
      // if (name === 'ssdp') {
      //   const stdoutString = stdout.replace(/^\s+|\s+$/g, ''); // remove leading and trailing whitespace
      //   const lines = stdoutString.split('\n');
      //   lines.forEach((line) => {
      //     const fields = line.match(/(\S+)/g); // extract all non-whitespace sequences
      //     if (fields.length >= 9) {
      //       const packetNumber = fields[0];
      //       const timeElapsed = fields[1];
      //       const sourceIp = fields[2];
      //       const destinationIp = fields[4];
      //       const protocol = fields[5];
      //       const packetLength = fields[6];
      //       const httpMethod = fields[7];
      //       const compatibility = fields[8];
      //       const httpRequestTarget = fields[9];
      //
      //       console.log({
      //         packetNumber,
      //         timeElapsed,
      //         sourceIp,
      //         destinationIp,
      //         protocol,
      //         packetLength,
      //         httpMethod,
      //         compatibility,
      //         httpRequestTarget,
      //       });
      //     }
      //   });
      // }

    });
  });

  
  return NextResponse.json({success: true});
}
