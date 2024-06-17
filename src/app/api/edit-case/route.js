const sqlite3 = require("sqlite3");
const {open} = require("sqlite");

// Initialize a variable to hold the SQLite database connection
let db = null;

export async function PUT(req) {
  // Open a new connection if there is none

  if (!db) {
    db = await open({
      filename: "./nfmvtDatabase.sqlite", driver: sqlite3.Database,
    });
  }

  // Extract the case details from the request body
  const {
    case_number,
    case_uuid,
    case_investigator_name,
    case_investigator_organization,
    case_description,
    case_status,
  } = await req.json();

  // Update the case details in the "case_details" table
  // await db.run("UPDATE case_details SET case_number = ?, case_description = ?, case_investigator_name = ?, case_investigator_organization = ? WHERE case_uuid = ?", [case_number,case_uuid,case_investigator_name,case_investigator_organization,case_description]);

  // Update the case details in the "case_details" table
    await db.run(
      "UPDATE case_details SET case_number = ?, case_description = ?, case_investigator_name = ?, case_investigator_organization = ?, case_status = ? WHERE case_uuid = ?",
      [
        case_number,
        case_description, // <-- case_description should be second
        case_investigator_name,
        case_investigator_organization,
        case_status,
        case_uuid, // <-- case_uuid should be last
      ],
    );


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
