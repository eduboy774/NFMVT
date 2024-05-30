const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { v4: uuidv4 } = require('uuid');
import {CREATE_TABLE_IF_NOT_EXISTS_CASE_DETAILS} from '../../database/schema'

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

  await db.run(CREATE_TABLE_IF_NOT_EXISTS_CASE_DETAILS);

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
