export const CREATE_SSDP_TABLE_NOT_EXIST=
`
CREATE TABLE IF NOT EXISTS ssdp(
  ssdp_case_uuid INTEGER NOT NULL  REFERENCES case_details(case_uuid),
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

export const GET_ALL_SSDP_DATA_PAGEABLE = `
  SELECT packetNumber, timeElapsed, sourceIp, destinationIp, protocol, packetLength, httpMethod, compatibility, httpRequestTarget
  FROM ssdp
  ORDER BY id ASC
  LIMIT ? OFFSET ?
`;


export const GET_CASE_DETAILS =
`
SELECT * FROM case_details
`
