import getDb from "../../database/db";
import { GET_ALL_HOSTS_DATA } from "../../database/schema";

export async function GET(req) {
  const caseUuid = req.nextUrl.searchParams.get("case_uuid");

  const db = await getDb();

  try {
    if (!caseUuid) {
      throw new Error("case_uuid is required");
    }

    // retrieve data from the hosts table specific to the case_uuid
    const HostsData = await db.all(
      `${GET_ALL_HOSTS_DATA} WHERE case_uuid = ?`,
      [caseUuid],
    );

    return new Response(JSON.stringify(HostsData), {
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
