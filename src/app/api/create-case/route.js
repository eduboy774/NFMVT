const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

export async function POST(req) {
  if (req.method !== "POST") {
    return new Response({ error: "Method not allowed." }, { status: 405 });
  }

  try {
    const db = await open({
      filename: "./myDatabase.sqlite",
      driver: sqlite3.Database,
    });

    const { caseNumber, caseDescription, investigator } = await req.json();

    // Create a table to store the case details, if it doesn't exist
    await db.run(`
      CREATE TABLE IF NOT EXISTS case_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_number INTEGER NOT NULL UNIQUE,
        case_description TEXT NOT NULL,
        investigator TEXT NOT NULL
      );
    `);

    // Insert the case details into the table
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO case_details (case_number, case_description, investigator) VALUES (?, ?, ?)",
        caseNumber,
        caseDescription,
        investigator,
        function (error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });

    return new Response({ message: "Case added successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response({ error: "An error occurred while adding case." }, { status: 500 });
  }
}
