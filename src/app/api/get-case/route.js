import sqlite3 from "sqlite3";
const { open } = require("sqlite");

let db = null;

export async function GET() {
  try {
    if (!db) {
      db = await open({
        filename: "./myDb.sqlite",
        driver: sqlite3.Database,
      });
    }

    const caseDetails = await db.all("SELECT * FROM case_details");

    return new Response(JSON.stringify(caseDetails), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response({ error: "An error occurred while fetching data." }, {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  } finally {
    // Close the database connection after each request
    if (db) {
      await db.close();
      db = null;
    }
  }
}
