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
    httpHeaders: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http" -T fields -e http.host -e http.request.method -e http.request.uri -e http.user_agent -e http.referer -e http.response.code -e http.content_type`,
    // http: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http"`,
    // ssdp: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "udp.port == 1900"`,
    // openPorts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -T fields -e ip.src -e tcp.dstport -e tcp.analysis.initial_rtt -e tcp.window_size_value -e tcp.options.mss`,
    // openPorts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -T fields -e ip.src -e tcp.dstport -e tcp.analysis.initial_rtt -e tcp.window_size_value -e tcp.options.mss | Sort-Object -Unique`,
    // connections: `${tsharkCommandExecutablePath} -r "${uploadPath}" -qz conv,ip`,
    // dnsSmbLdapServers: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "dns || dhcp || ldap" -T fields -e frame.number -e frame.time -e ip.src -e ip.dst -e dns -e dhcp -e ldap`,
    // arp: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "arp" -T fields -e arp.src.hw_mac -e arp.src.proto_ipv4 -e arp.dst.hw_mac -e arp.dst.proto_ipv4 | Sort-Object -Unique`,
    // arp: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "arp" -T fields -e arp.src.hw_mac -e arp.src.proto_ipv4 -e arp.dst.hw_mac -e arp.dst.proto_ipv4`,
    // hosts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "dns or smb or nbns" -T fields -e ip.src -e eth.src -e eth.src_resolved -e ip.dst -e eth.dst -e eth.dst_resolved | Sort-Object -Unique`,
    // hosts: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "dns or smb or nbns" -T fields -e ip.src -e eth.src -e eth.src_resolved -e ip.dst -e eth.dst -e eth.dst_resolved"`,
    // httpEverything: `${tsharkCommandExecutablePath} -r "${uploadPath}" -Y "http" -T fields -e frame.number -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e http.request.method -e http.host -e http.user_agent -e http.referer -e http.response.code -e http.content_type -e http.cookie -e http.request.uri -e http.server -e http.content_length -e http.transfer_encoding -e http.cache_control -e http.authorization -e http.location -e http.connection`
  };

  // Execute the tshark commands
  Object.entries(tsharkCommands).forEach(([name, command]) => {
    // console.log(`Executing command "${name}": ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command "${name}": ${error}`);
        return;
      }
      // Running command
      console.log(tsharkCommands)
      
      // Checking commands
      if (tsharkCommands.httpHeaders){
        const output = stdout;
        const entries = output.trim().split('\n\n');
        console.log(entries)

        const mappedEntries = entries.map((entry) => {
          const lines = entry.split('\r\n');
          const [httpUserAgent, httpHost, httpMethod, httpVersion, httpReferer, httpUri] = lines[0].split('\t');
          const responseCode = parseInt(lines[1].trim());
          const contentType = lines[2].split(' ')[1];

          return {
            http_header_id: uuidv4(), 
            http_host: httpUserAgent,
            http_method: httpHost,
            http_uri: httpMethod,
            http_user_agent: httpReferer,
            http_referer: null, // Not provided in the output
            http_response_code: responseCode,
            http_content_type: contentType,
            file_id: null // Not provided in the output
          };
        });

        console.log(mappedEntries);
        console.log(`HTTP HEADERS\n${stdout}`);
      } 
      // if(tsharkCommands.http){
      //   console.log(`HTTP\n${stdout}`);
      // } 
      // if(tsharkCommands.ssdp) {
      //   console.log(`SSDP\n${stdout}`);
      // }
      
      // console.log(`Command output (${name}): ${stdout}`);

      // 
    });
  });

  return NextResponse.json({success: true});
}
