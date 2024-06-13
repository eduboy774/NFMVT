import getDb from "../../database/db";
import { GET_ALL_SSDP_DATA_PAGEABLE } from "../../database/schema";

export async function GET(req) {
  const case_uuid = req.nextUrl.searchParams.get("case_uuid");

  if (!case_uuid) {
    return new Response(JSON.stringify({ error: "case_uuid is required" }), {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  const limit = req.nextUrl.searchParams.get("limit");
  const page = req.nextUrl.searchParams.get("page");
  const db = await getDb();

  try {
    const offset = limit * (page - 1);
    // Modify the SQL query to include the WHERE clause for case_uuid
    const ssdpData = await db.all(GET_ALL_SSDP_DATA_PAGEABLE, [
      case_uuid,
      limit,
      offset,
    ]);
    const totalRecordsResults = await db.get(
      "SELECT COUNT(*) FROM ssdp WHERE case_uuid = ?",
      [case_uuid],
    );
    const totalRecords = totalRecordsResults["COUNT(*)"];
    return new Response(
      JSON.stringify({
        data: ssdpData,
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
      { error: "An error occurred while fetching data." },
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
