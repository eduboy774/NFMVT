import getDb from "../../database/db";
import { GET_ALL_SSDP_DATA } from "../../database/schema";

export async function GET(req) {
  const case_uuid = req.nextUrl.searchParams.get("case_uuid");
  console.log({case_uuid:req?.nextUrl.searchParams});

  if (!case_uuid) {
    return new Response(JSON.stringify({ error: "case_uuid is required" }), {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  const db = await getDb();

  try {
    // Modify the SQL query to include the WHERE clause for case_uuid
    const ssdpData = await db.all(GET_ALL_SSDP_DATA, [case_uuid]);

    return new Response(JSON.stringify(ssdpData), {
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
