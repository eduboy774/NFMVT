import getDb from "../../database/db";
import {GET_ALL_HOSTS_DATA} from '../../database/schema'


export async function GET() {

  const db = await getDb();

  try {
    // retrieve data from the ssdp table
    const HostsData = await db.all(GET_ALL_HOSTS_DATA);

    return new Response(JSON.stringify(HostsData), {
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



