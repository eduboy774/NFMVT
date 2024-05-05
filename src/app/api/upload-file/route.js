import multer from 'multer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const upload = multer({ dest: 'case_files/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize a variable to hold the SQLite database connection
let db = null;

export async function POST(request) {
  // Open a new connection if there is none
  if (!db) {
    db = await open({
      filename: "./nfmvtDatabaseNew.sqlite",
      driver: sqlite3.Database,
    });
  }

  // Use the Multer middleware to handle file uploads
  return new Promise((resolve, reject) => {
    upload.single('file')(request, {}, async (error) => {
      if (error) {
        console.error(error);
        resolve(
          new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          })
        );
        return;
      }

      try {
        await db.run('CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, name TEXT, path TEXT)');
      console.log(request);
        const file = {
          name: request.file.name,
          path: request.file.path,
        };

        const result = await db.run('INSERT INTO files (name, path) VALUES (?, ?)', [file.name, file.path]);

        // Return a success message as a JSON response with a 200 status code
        resolve(
          new Response(
            JSON.stringify({ message: "success" }),
            {
              headers: { "content-type": "application/json" },
              status: 200,
            }
          )
        );
      } catch (error) {
        console.error(error);
        resolve(
          new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          })
        );
      }
    });
  });
}
