import getDb from "../../database/db";

export async function DELETE(req) {
  // Get the database connection
  const db = await getDb();

  // Extract the case_uuid from the request parameters
  const case_uuid  = req.nextUrl.searchParams.get("case_uuid") ;

  // Delete the case from the "case_details" table
  await db.run("DELETE FROM case_details WHERE case_uuid = ?", [case_uuid]);

  // Return a success message as a JSON response with a 200 status code
  return new Response(
    JSON.stringify(
      { message: "success" },
      {
        headers: { "content-type": "application/json" },
        status: 200,
      }
    )
  );
}
