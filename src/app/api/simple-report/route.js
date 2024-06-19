import getDb from "../../database/db";
import { GET_SIMPLE_REPORT ,GET_ALL_SSDP_DATA} from "../../database/schema";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Chart from 'chart.js/auto';

function createLineChart(data, width, height) {
  const labels = data.map((row) => row[1]); // Use time elapsed as labels

  // Extract packet length data for each protocol
  const packetLengths = {};
  data.forEach((row) => {
    const protocol = row[5];
    if (!packetLengths[protocol]) {
      packetLengths[protocol] = [];
    }
    packetLengths[protocol].push(row[4]);
  });

  // Create datasets for each protocol
  const datasets = Object.entries(packetLengths).map(([protocol, lengths]) => ({
    label: protocol,
    data: lengths,
    borderColor: getRandomColor(),
    fill: false,
  }));

  // Create a canvas element and get its context
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Create a line chart using Chart.js
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time Elapsed (s)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Packet Length (bytes)',
          },
        },
      },
    },
  });

  // Convert the canvas to a PNG data URL
  const imageUrl = canvas.toDataURL('image/png');
  return imageUrl;
}

// Helper function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


export async function GET() {
  const db = await getDb();
  try {

    const simpleCaseReport = await db.all(GET_SIMPLE_REPORT);
    const case_uuid = simpleCaseReport[0]?.case_uuid || 'undefined';
    const ssdpData = await db.all(GET_ALL_SSDP_DATA, [case_uuid]);
    const ssdpDataSubset = ssdpData.slice(0, 10);

    // Extract the necessary data from the first object in simpleCaseReport
    const investigatorName = simpleCaseReport[0]?.case_investigator_name || 'Unknown';
    const createdDate = simpleCaseReport[0]?.created_at || 'Unknown';
    const case_description = simpleCaseReport[0]?.case_description || 'Unknown';
    const case_number = simpleCaseReport[0]?.case_number || 'Unknown';
    

    //
    const no_of_ssdp = simpleCaseReport[0]?.no_of_ssdp || 0;
    const no_of_hosts = simpleCaseReport[0]?.no_of_hosts || 0;
    const no_of_arp = simpleCaseReport[0]?.no_of_arp || 0;
    const no_of_dns_smb_ldap_servers = simpleCaseReport[0]?.no_of_dns_smb_ldap_servers || 0;
    const no_of_http_headers = simpleCaseReport[0]?.no_of_http_headers || 0;
    const no_of_http_everything = simpleCaseReport[0]?.no_of_http_everything || 0;
    const no_of_connections = simpleCaseReport[0]?.no_of_http_everything || 0;
    

    

    // Create a new PDF document
    const doc = new jsPDF();

    // Set the font and font size
    doc.setFont("helvetica");
    doc.setFontSize(16);

    // Add a title to the document
    const title =  case_description+' '+'Report';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
    doc.text(title, titleX, 20);

      // Calculate the x-coordinates for 'Prepared By' and 'Report Date'
      const preparedByText = `Prepared By ${investigatorName}`;
      const preparedByWidth = doc.getTextWidth(preparedByText);
      const preparedByX = doc.internal.pageSize.getWidth() - preparedByWidth - 15;

      const reportDateText = `Date ${createdDate}`;
      const reportDateWidth = doc.getTextWidth(reportDateText);
      const reportDateX = doc.internal.pageSize.getWidth() - reportDateWidth - 15;

      // Set the font size for 'Prepared By' and 'Report Date'
      doc.setFontSize(12);

      // Add 'Prepared By' and 'Report Date' to the right side of the title
      doc.text(case_number, 15, 40);
      doc.text(preparedByText, preparedByX, 40);
      doc.text(reportDateText, reportDateX, 50);

    // Set the font size for the table headers

    // Add a card showing the summary of the number of results
    const summaryText = [
      `SSDP: ${no_of_ssdp}`,
      `Hosts: ${no_of_hosts}`,
      `ARP: ${no_of_arp}`,
      `Servers: ${no_of_dns_smb_ldap_servers}`,
      `Headers: ${no_of_http_headers}`,
      `Everything: ${no_of_http_everything}`,
      `Connections: ${no_of_connections}`
    ];


    const summaryX = 15; // x-coordinate of the summary card
    const summaryY = 60; // fixed y-coordinate for the summary card
    doc.setFontSize(10);
    // doc.text("Summary:", summaryX, summaryY - 10);

    

    // Draw a rectangle around the summary text
    doc.rect(summaryX - 5, summaryY - 5, doc.internal.pageSize.getWidth() - 2 * 15 + 10, 20);
    
    // Add the summary text to the card horizontally
    let x = summaryX;
    summaryText.forEach((text) => {
      doc.cell(x, summaryY, 25, 15, text, 1);
      x += 25; // adjust the width as needed
    });


    doc.setFontSize(14);
    doc.setTextColor(40, 122, 183); // set the text color to blue
    const tableTitle = "Ssdp";
    const tableTitleWidth = doc.getTextWidth(tableTitle);
    const tableTitleX = (doc.internal.pageSize.getWidth() - tableTitleWidth) / 2;
    doc.text(tableTitle, tableTitleX, summaryY + 50);
    doc.setTextColor(0); // reset the text color to black



   // Set the font size for the table headers
    doc.setFontSize(12);
    // Add the table headers

    doc.text("Ssdp:", summaryX, summaryY - 10);
    const headers = [
      "Packet Number	",
      "Time Elapsed	",
      "Source IP",
      "Destination IP	",
      "Packet Length",
      "Protocol",
      "HTTP Method",
      "HTTP Request Target",
    ];
   
    autoTable(doc, { head: [headers], startY: summaryY + 7 * summaryText.length + 10, styles: { fontSize: 7, fontStyle: "bold" } });


    // Add the table data
    const data = ssdpDataSubset?.map(row => [
      row.packetNumber,
      row.timeElapsed,
      row.sourceIp,
      row.destinationIp,
      row.packetLength,
      row.protocol,
      row.httpMethod,
      row.httpRequestTarget,
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
