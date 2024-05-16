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

