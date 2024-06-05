import getDb from "../../database/db";
import {GET_ALL_HTTP_REQUESTS} from '../../database/schema'


export async function GET() {

  const db = await getDb();

  try {
    // retrieve data from the ssdp table
    const httpRequestsData = await db.all(GET_ALL_HTTP_REQUESTS);

    return new Response(JSON.stringify(httpRequestsData), {
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
      // db.close()
    }
  }
}




