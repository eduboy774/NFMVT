import getDb,{closeDb} from "../../database/db";
import {GET_ALL_SSDP_DATA_PAGEABLE} from '../../database/schema'

export async function GET() {

  const db = await getDb();

  try {
    // retrieve data from the ssdp table

    const limit = 10;
    const offset = limit * (page - 1);
    const ssdpResponce = await db.all(GET_ALL_SSDP_DATA_PAGEABLE, [limit, offset]);

    return new Response(JSON.stringify({
      data: ssdpResponce,
      page: page,
      limit: limit,
      total: (await db.get('SELECT COUNT(*) FROM ssdp')).total
    }), {
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
      closeDb()
    }
  }
}
