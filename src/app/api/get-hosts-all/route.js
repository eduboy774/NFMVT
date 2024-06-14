import getDb from "../../database/db";
import { GET_ALL_HOSTS_DATA } from "../../database/schema";

export async function GET(req) {
  const case_uuid = req.nextUrl.searchParams.get("case_uuid");

  if (!case_uuid) {
    return new Response(JSON.stringify({ error: "case_uuid is required" }), {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }

  const db = await getDb();

  try {
    

    // retrieve data from the hosts table specific to the case_uuid
    const hostsData = await db.all(GET_ALL_HOSTS_DATA,[case_uuid]);

    return new Response(JSON.stringify(hostsData), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while fetching data." }),
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
