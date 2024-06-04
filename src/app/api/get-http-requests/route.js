import getDb,{closeDb} from "../../database/db";
import {GET_ALL_HTTP_REQUESTS_PAGEABLE} from '../../database/schema'

export async function GET(req,resp) {

  const limit = req.nextUrl.searchParams.get("limit") ;
  const page = req.nextUrl.searchParams.get("page");
  const db = await getDb();

  try {
    const offset = limit * (page - 1);
    const httpRequestsData = await db.all(GET_ALL_HTTP_REQUESTS_PAGEABLE, [limit, offset]);
    const totalRecordsResults = (await db.get('SELECT COUNT(*) FROM http_requests'));
    const totalRecords = totalRecordsResults['COUNT(*)'];
    return new Response(JSON.stringify({
      data: httpRequestsData,
      page: page,
      limit: limit,
      total: totalRecords,
      pageCount:Math.ceil(totalRecords/limit)
    }), {
      headers: { "Content-type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response({ error: "An error occurred while fetching data." }, {
      headers: { "Content-type": "application/json" },
      status: 500,
    });
  } finally {
    // Close the database connection after each request
    if (db) {
      // db.close()
    }
  }
}