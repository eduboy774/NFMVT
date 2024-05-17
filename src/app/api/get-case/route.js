import getDb from "../../database/db";
import {GET_CASE_DETAILS} from '../../database/schema'

export async function GET() {

  const db = await getDb();
  try {
   
    const caseDetails = await db.all(GET_CASE_DETAILS); 

    return new Response(JSON.stringify(caseDetails), {
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
