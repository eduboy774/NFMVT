import getDb from "../../database/db";
import { GET_HTTP_EVERYTHING } from "../../database/schema";

export async function GET(req, resp) {
  const caseUuid = req.nextUrl.searchParams.get("case_uuid");

  const db = await getDb();

  try {
    // retrieve data from the http_everything table filtered by case_uuid
    const httpEverythingData = await db.all(GET_HTTP_EVERYTHING, [caseUuid]);

    return new Response(JSON.stringify(httpEverythingData), {
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
