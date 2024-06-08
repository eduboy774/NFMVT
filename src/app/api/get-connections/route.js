import getDb from "../../database/db";
import { GET_ALL_CONNECTIONS_DATA_PAGEABLE } from "../../database/schema";

export async function GET(req) {
  const caseUuid = req.nextUrl.searchParams.get("case_uuid");
  const limit = req.nextUrl.searchParams.get("limit");
  const page = req.nextUrl.searchParams.get("page");

  if (!caseUuid) {
    return new Response(JSON.stringify({ error: "case_uuid is required" }), {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  const db = await getDb();

  try {
    const offset = limit * (page - 1);
    // Modify the SQL query to include the WHERE clause for case_uuid
    const connectionsData = await db.all(GET_ALL_CONNECTIONS_DATA_PAGEABLE, [
      caseUuid,
      limit,
      offset,
    ]);
    // Get the total count of records for pagination
    const totalRecordsResults = await db.get(
      "SELECT COUNT(*) FROM connections WHERE case_uuid = ?",
      [caseUuid],
    );
    const totalRecords = totalRecordsResults["COUNT(*)"];

    return new Response(
      JSON.stringify({
        data: connectionsData,
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
