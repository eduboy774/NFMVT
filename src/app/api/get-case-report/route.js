import getDb from "../../database/db";
import {GET_SIMPLE_REPORT} from '../../database/schema'

export async function GET() {

  const db = await getDb();
  try {
   
    const simpleCaseReport = await db.all(GET_SIMPLE_REPORT); 

    return new Response(JSON.stringify(simpleCaseReport), {
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
      // await db.close();
      // db = null;
    }
  }
}
