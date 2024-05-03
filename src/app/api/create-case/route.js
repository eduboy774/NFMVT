const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// Initialize a variable to hold the SQLite database connection
let db = null;

export async function POST(req) {
  // Open a new connection if there is none
  if (!db) {
    db = await open({
      filename: "./myDb.sqlite",
      driver: sqlite3.Database,
    });
  }

  // Extract the task from the request body
  const { caseNumber, caseDescription, investigator } = await req.json();

  await db.run(`
  CREATE TABLE IF NOT EXISTS case_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_number INTEGER NOT NULL UNIQUE,
    case_description TEXT NOT NULL,
    investigator TEXT NOT NULL
  );
`);

  // Insert the new task into the "todo" table
  await db.run("INSERT INTO case_details(case_number, case_description, investigator) VALUES (?, ?, ?)",[caseNumber, caseDescription, investigator]);

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
