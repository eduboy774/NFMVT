import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { toast } from 'react-toastify';
export  async function POST(req) {
  
  const db = await open({
    filename: "./nfmvtDatabase.sqlite",
    driver: sqlite3.Database,
  });
  
  const { ipv4hosts } = await req.json();

  if (req.method === "POST") {

    try {
     
      // Create a table to store the IP addresses, if it doesn't exist
      await db.run(`
        CREATE TABLE IF NOT EXISTS ip_addresses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ip_address TEXT NOT NULL UNIQUE
        );
      `);

      // Insert the IP addresses into the table
      const insertPromises = ipv4hosts?.map((ip) => {
        return db.run("INSERT INTO ip_addresses (ip_address) VALUES (?)", ip);
      });

      await Promise.all(insertPromises);
      // toast.success("Successfully");
      return Response.json({ message: "Successfully." }) 
    } catch (error) {
      console.error("Error:", error);
      return new Response({ error: "An error occurred while inserting the data." },{status:500});
    }
  } else {
    return new Response({ error: "Method not allowed." },{status:405});
  }
}
