import getDb from "../../database/db";
import { GET_ALL_HTTP_REQUESTS } from "../../database/schema";

export async function GET(req) {
  const caseUuid = req.nextUrl.searchParams.get("case_uuid");

  if (!caseUuid) {
    return new Response(JSON.stringify({ error: "case_uuid is required" }), {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  const db = await getDb();

  try {
    // Modify the SQL query to include the WHERE clause for case_uuid
    const httpRequestsData = await db.all(GET_ALL_HTTP_REQUESTS, [caseUuid]);

    return new Response(JSON.stringify(httpRequestsData), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      { error: "An error occurred while fetching data." },
      {
        headers: { "content-type": "application/json" },
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
