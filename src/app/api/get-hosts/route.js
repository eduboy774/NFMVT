import getDb, { closeDb } from "../../database/db";
import { GET_ALL_HOSTS_DATA_PAGEABLE } from "../../database/schema";

export async function GET(req, resp) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit"), 10);
  const page = parseInt(req.nextUrl.searchParams.get("page"), 10);
  const caseUuid = req.nextUrl.searchParams.get("case_uuid");

  const db = await getDb();

  try {
    if (!caseUuid) {
      throw new Error("case_uuid is required");
    }

    const offset = limit * (page - 1);
    const HostsRecords = await db.all(GET_ALL_HOSTS_DATA_PAGEABLE, [
      caseUuid,
      limit,
      offset,
    ]);

    const totalRecordsResults = await db.get(
      "SELECT COUNT(*) FROM hosts WHERE case_uuid = ?",
      [caseUuid],
    );
    const totalRecords = totalRecordsResults["COUNT(*)"];

    return new Response(
      JSON.stringify({
        data: HostsRecords,
        page: page,
        limit: limit,
        total: totalRecords,
        pageCount: Math.ceil(totalRecords / limit),
      }),
      {
        headers: { "Content-type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while fetching data." }),
      {
        headers: { "Content-type": "application/json" },
        status: 500,
      },
    );
  } finally {
    if (db) {
      // db.close();
    }
  }
}
