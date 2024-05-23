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
export const CREATE_ARP_TABLE_IF_NOT_EXIST = `
        CREATE TABLE IF NOT EXISTS arp (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          arp_uuid TEXT NOT NULL,
          arp_src_hw_mac TEXT,
          arp_src_proto_ipv4 TEXT,
          arp_dst_hw_mac TEXT,
          arp_dst_proto_ipv4 TEXT,
          case_uuid TEXT
        )
 `;



export const GET_ALL_HOSTS_DATA_PAGEABLE = `SELECT * FROM hosts ORDER BY host_uuid DESC LIMIT ? OFFSET ?; `;
export const GET_ALL_SSDP_DATA_PAGEABLE = `SELECT * FROM ssdp LIMIT ? OFFSET ? `;
export const GET_ALL_SSDP_DATA = `SELECT * FROM ssdp`;
export const GET_CASE_DETAILS =  `SELECT * FROM case_details`
