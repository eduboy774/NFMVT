import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Initialize a variable to hold the SQLite database connection
let db = null;

// Handler for GET requests to retrieve all ips
export async function GET() {
  // Open a new connection if there is none
 

  if (!db) {
    db = await open({
      filename: "./myDb.sqlite",
      driver: sqlite3.Database,
    });
  }

  // Query to get all todos from the "todo" table
  const allIps = await db.all("SELECT * FROM ip_addresses");

  // Return the todos as a JSON response with a 200 status code
  return new Response(JSON.stringify(allIps), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}
