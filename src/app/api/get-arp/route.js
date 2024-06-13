import getDb from "../../database/db";
import { GET_ALL_ARP } from "../../database/schema";

export async function GET(req) {
  const limit = req.nextUrl.searchParams.get("limit");
  const page = req.nextUrl.searchParams.get("page");
  const case_uuid = req.nextUrl.searchParams.get("case_uuid");

  const db = await getDb();

  try {
    const offset = limit * (page - 1);
    // Modify the SQL query to include LIMIT and OFFSET clauses with case_uuid filtering
    const arpRecords = await db.all(`${GET_ALL_ARP} LIMIT ? OFFSET ?`, [
      case_uuid,
      limit,
      offset,
    ]);
    const totalRecordsResults = await db.get(
      "SELECT COUNT(*) FROM arp WHERE case_uuid = ?",
      [case_uuid],
    );
    const totalRecords = totalRecordsResults["COUNT(*)"];
    return new Response(
      JSON.stringify({
        data: arpRecords,
        page: page,
        limit: limit,
        total: totalRecords,
        pageCount: Math.ceil(totalRecords / limit),
      }),
      {
        headers: { "Content-type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while fetching data." }),
      {
        headers: { "Content-type": "application/json" },
        status: 500,
      },
    );
  } finally {
    // Close the database connection after each request
    if (db) {
      // db.close()
    }
  }
}
