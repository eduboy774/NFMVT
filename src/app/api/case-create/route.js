const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { v4: uuidv4 } = require('uuid');

// Initialize a variable to hold the SQLite database connection
let db = null;

export async function POST(req) {
  // Open a new connection if there is none
  if (!db) {
    db = await open({
      filename: "./nfmvtDatabase.sqlite",
      driver: sqlite3.Database,
    });
  }

  // Extract the task from the request body
  const { caseNumber, caseDescription, investigator, organization } = await req.json();

  await db.run(`
    CREATE TABLE IF NOT EXISTS case_details (
      case_uuid VARCHAR(36) PRIMARY KEY,
      case_number VARCHAR(15) UNIQUE NOT NULL,
      case_description VARCHAR(255) NOT NULL,
      case_investigator_name VARCHAR(50) NOT NULL,
      case_investigator_organization VARCHAR(50) NOT NULL,
      case_status VARCHAR(10) NOT NULL CHECK(case_status IN ('Active', 'Closed')) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_case_uuid ON case_details (case_uuid);
    CREATE INDEX IF NOT EXISTS idx_case_number ON case_details (case_number);
    CREATE INDEX IF NOT EXISTS idx_case_investigator_name ON case_details (case_investigator_name);
    CREATE INDEX IF NOT EXISTS idx_case_investigator_organization ON case_details (case_investigator_organization);
    CREATE INDEX IF NOT EXISTS idx_case_status ON case_details (case_status);
    CREATE INDEX IF NOT EXISTS idx_created_at ON case_details (created_at);
  `);

  // Generate a new UUID for the case
  const case_uuid = uuidv4();
  
  // Insert the new task into the "todo" table
  await db.run("INSERT INTO case_details(case_uuid, case_number, case_description, case_investigator_name, case_investigator_organization, case_status) VALUES (?, ?, ?, ?, ?, ?)", [case_uuid, caseNumber, caseDescription, investigator, organization, 'Active']);

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
