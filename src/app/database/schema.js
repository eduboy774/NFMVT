export const CREATE_SSDP_TABLE_NOT_EXIST=
`
CREATE TABLE IF NOT EXISTS ssdp(
  ssdp_uuid TEXT PRIMARY KEY,
  case_uuid INTEGER NOT NULL  REFERENCES case_details(case_uuid),
  packetNumber INTEGER, 
  timeElapsed REAL, 
  sourceIp TEXT, 
  destinationIp TEXT, 
  protocol TEXT, 
  packetLength INTEGER, 
  httpMethod TEXT, 
  compatibility TEXT, 
  httpRequestTarget TEXT
);
`

// export const GET_ALL_SSDP_DATA_PAGEABLE = `
//   SELECT *
//   FROM ssdp
//   GROUP BY case_uuid 
//   LIMIT ? OFFSET ?
// `;
export const GET_ALL_SSDP_DATA_PAGEABLE = `
  SELECT *
  FROM ssdp
`;


export const GET_CASE_DETAILS =
`
SELECT * FROM case_details
`
