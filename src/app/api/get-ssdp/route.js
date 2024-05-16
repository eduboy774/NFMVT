import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

export async function GET() {
  try {
    if (!db) {
      db = await open({
        filename: "./nfmvtDatabaseNew.sqlite",
        driver: sqlite3.Database,
      });
    }

    // retrieve data from the ssdp table
    const ssdpResponce = await db.all('SELECT packetNumber, timeElapsed, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, httpRequestTarget FROM ssdp');

    return new Response(JSON.stringify(ssdpResponce), {
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
