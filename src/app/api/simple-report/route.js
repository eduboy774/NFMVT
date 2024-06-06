import getDb from "../../database/db";
import { GET_SIMPLE_REPORT } from "../../database/schema";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET() {
  const db = await getDb();
  try {
    const simpleCaseReport = await db.all(GET_SIMPLE_REPORT);

    // Create a new PDF document
    const doc = new jsPDF();

    // Set the font and font size
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);

    // Add a title to the document
    doc.setFontSize(20);
    const title = "NFMVT Case Report";
    const titleWidth = doc.getTextWidth(title);
    const x = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
    doc.text(title, x, 20);


    // Set the font size for the table headers
    doc.setFontSize(12);

    // Add the table headers
    const headers = [
      "Case Number",
      "Description",
      "Investigator",
      "Organization",
      "Status",
      "Created",
      "SSDP",
      "Hosts",
      "ARP",
      "Servers",
      "Headers",
      "Everything",
      "Connections"
    ];
   
    autoTable(doc, { head: [headers], startY: 30, styles: { fontSize: 7, fontStyle: "bold" } });

    // Add the table data
    const data = simpleCaseReport.map(row => [
      row.case_number,
      row.case_description,
      row.case_investigator_name,
      row.case_investigator_organization,
      row.case_status,
      row.created_at,
      row.no_of_ssdp,
      row.no_of_hosts,
      row.no_of_arp,
      row.no_of_dns_smb_ldap_servers,
      row.no_of_http_headers,
      row.no_of_http_everything,
      row.no_of_connections
    ]);
    // doc.autoTable({ body: data, startY: doc.autoTableEndPosY() + 10 });
    autoTable(doc, { body: data, startY: doc.autoTableEndPosY() + 10 });

    // Save the PDF document
    const pdfData = doc.output();

    // Set the response headers and return the PDF data
    return new Response(pdfData, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=simple_case_report.pdf"
      },
      status: 200
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response({ error: "An error occurred while fetching data." }, {
      headers: { "content-type": "application/json" },
      status: 500
    });
  } finally {
    // Close the database connection after each request
    if (db) {
      // await db.close();
      // db = null;
    }
  }
}
