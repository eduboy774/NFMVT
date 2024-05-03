const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// Initialize a variable to hold the SQLite database connection
let db = null;

export async function POST(req) {
  // Open a new connection if there is none
  if (!db) {
    db = await open({
      filename: "./nfmvtDatabaseNew.sqlite",
      driver: sqlite3.Database,
    });
  }

  // Extract the task from the request body
    const {caseNumber,fileName,fileType,fileSize,fileTimeStapms} = await req.json();

  await db.run(`
  CREATE TABLE IF NOT EXISTS file_details (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_case_number INTEGER NOT NULL UNIQUE REFERENCES case_details(case_number),
    file_name INTEGER NOT NULL,
    file_type TEXT NULL,
    file_size TEXT NOT NULL,
    file_time_stamps TEXT NOT NULL
  );
`);

  // Insert the new task into the "todo" table
  await db.run("INSERT INTO file_details(file_case_number,file_name, file_type, file_size,file_time_stamps) VALUES (?, ?, ?, ?, ?)",[caseNumber,fileName, fileType, fileSize,fileTimeStapms]);

 // Return a success message as a JSON response with a 200 status code
 return new Response(
  JSON.stringify(
    { message: "success" },
    {
      headers: { "content-type": "application/json" },
      status: 200,
    }
  )
);

  
}
