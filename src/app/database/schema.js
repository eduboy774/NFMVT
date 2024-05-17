// Table creation queries

export const CREATE_HOSTS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS hosts (
  host_uuid                     VARCHAR(36) PRIMARY KEY,
  host_source_ip                VARCHAR(15) NOT NULL,
  host_source_eth_mac           VARCHAR(30) NOT NULL,
  host_source_eth_resolved      VARCHAR(30) NOT NULL,
  host_destination_ip           VARCHAR(15) NOT NULL,
  host_destination_eth_mac      VARCHAR(30) NOT NULL,
  host_destination_eth_resolved VARCHAR(30) NOT NULL,
  case_uuid                     VARCHAR(36),
  FOREIGN KEY (case_uuid) REFERENCES case_details (case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_SSDP_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS ssdp (
  ssdp_request_uuid           VARCHAR(36) PRIMARY KEY,
  ssdp_request_source_ip      VARCHAR(15)  NOT NULL,
  ssdp_request_destination_ip VARCHAR(15)  NOT NULL,
  ssdp_request_protocol       VARCHAR(10)  NOT NULL,
  ssdp_request_method         VARCHAR(10)  NOT NULL,
  ssdp_request_uri            VARCHAR(255) NOT NULL,
  ssdp_request_status_code    INT,
  case_uuid                   VARCHAR(36),
  FOREIGN KEY (case_uuid) REFERENCES case_details (case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;
// -- CREATE TABLE IF NOT EXISTS ssdp(
//   --   ssdp_case_uuid INTEGER NOT NULL  REFERENCES case_details(case_uuid),
//   --   packetNumber INTEGER,
//   --   timeElapsed REAL,
//   --   sourceIp TEXT,
//   --   destinationIp TEXT,
//   --   protocol TEXT,
//   --   packetLength INTEGER,
//   --   httpMethod TEXT,
//   --   compatibility TEXT,
//   --   httpRequestTarget TEXT
// -- );



// Pageable data queries

export const GET_ALL_HOSTS_DATA_PAGEABLE = `SELECT * FROM hosts ORDER BY host_uuid DESC LIMIT ? OFFSET ?; `;

export const GET_ALL_SSDP_DATA_PAGEABLE = `SELECT  * FROM ssdp ORDER BY ssdp_request_uuid ASC LIMIT ? OFFSET ?; `;

export const GET_CASE_DETAILS =  `SELECT * FROM case_details`
