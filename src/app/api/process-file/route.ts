import { exec } from 'child_process';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const form = new IncomingForm({ uploadDir: './public/uploads' });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error processing file' });
    }

    try {
      const filePath = files.file.path;

      // Define tshark arguments for each command
      const tsharkArgsList = [
        // ...
      ];

      // Array to store results
      let results = [];

      // Process each tshark command
      await Promise.all(
        tsharkArgsList.map((tsharkArgs) =>
          processFile(filePath, tsharkArgs).then(({ heading, output }) => {
            // Check if the output is empty or contains only whitespace
            if (output.trim() !== '') {
              // Save output to results array
              results.push({ heading, output });
            } else {
              console.log(`Skipping saving empty output for ${heading}`);
            }
          })
        )
      );

      // Extract filename without extension from the file path
      const filenameWithoutExt = path.basename(filePath, path.extname(filePath));

      // Get current timestamp
      const timestamp = new Date().toISOString().replace(/:/g, '-');

      // Generate filename with timestamp
      const filename = `./public/uploads/${filenameWithoutExt}_${timestamp}.json`;

      // Save results to JSON file
      fs.writeFileSync(filename, JSON.stringify(results, null, 2));
      console.log(`Results saved to ${filename}`);

      // Send response to client
      res.status(200).send({ message: 'File processed successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Error processing file' });
    }
  });
}

function processFile(filePath: string, tsharkArgs: any, heading: string) {
  return new Promise((resolve, reject) => {
    // Command to run tshark with provided arguments
    const command = `${tsharkArgs.TSHARK_PATH} -r "${filePath}" ${tsharkArgs.additionalArgs}`;

    // Execute the tshark command with increased maxBuffer size
    const childProcess = exec(
      command,
      { maxBuffer: 1024 * 10000 },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          reject(stderr);
          return;
        }
        resolve({ heading, output: stdout });
      }
    );

    // Log any error from the child process
    childProcess.on('error', (err) => {
      reject(err);
    });
  });
}
