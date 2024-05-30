export const CREATE_SSDP_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS ssdp(
                                   ssdp_uuid TEXT PRIMARY KEY,
                                   case_uuid TEXT NOT NULL REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
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
export const CREATE_HTTP_HEADERS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS http_headers (
                                            http_uuid TEXT PRIMARY KEY,source_ip TEXT,
                                            destination_ip TEXT,
                                            method TEXT,
                                            uri TEXT,
                                            user_agent TEXT,
                                            referer TEXT,
                                            status_code TEXT,
                                            content_type TEXT,
                                            case_uuid TEXT NOT NULL REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  )`;

export const CREATE_HTTP_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS http (
                                    http_uuid TEXT PRIMARY KEY,source_ip TEXT,
                                    destination_ip TEXT,
                                    method TEXT,
                                    uri TEXT,
                                    user_agent TEXT,
                                    referer TEXT,
                                    status_code TEXT,
                                    content_type TEXT,
                                    case_uuid TEXT NOT NULL REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  )`;

export const CREATE_HOSTS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS hosts (
                                     host_uuid TEXT PRIMARY KEY,
                                     host_source_ip TEXT,
                                     host_source_eth_mac TEXT,
                                     host_source_eth_resolved TEXT,
                                     host_destination_ip TEXT,
                                     host_destination_eth_mac TEXT,
                                     host_destination_eth_resolved TEXT,
                                     case_uuid TEXT REFERENCES case_details (case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_OPEN_PORTS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS openPorts (
                                         host_uuid TEXT PRIMARY KEY,
                                         host_source_ip TEXT,
                                         host_source_eth_mac TEXT,
                                         host_source_eth_resolved TEXT,
                                         host_destination_ip TEXT,
                                         host_destination_eth_mac TEXT,
                                         host_destination_eth_resolved TEXT,
                                         case_uuid TEXT REFERENCES case_details (case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_CONNECTIOINS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS connections (
                                           host_uuid TEXT PRIMARY KEY,
                                           host_source_ip TEXT,
                                           host_source_eth_mac TEXT,
                                           host_source_eth_resolved TEXT,
                                           host_destination_ip TEXT,
                                           host_destination_eth_mac TEXT,
                                           host_destination_eth_resolved TEXT,
                                           case_uuid TEXT REFERENCES case_details (case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_dnsSmbLdapServers_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS dnsSmbLdapServers (
                                                 host_uuid TEXT PRIMARY KEY,
                                                 host_source_ip TEXT,
                                                 host_source_eth_mac TEXT,
                                                 host_source_eth_resolved TEXT,
                                                 host_destination_ip TEXT,
                                                 host_destination_eth_mac TEXT,
                                                 host_destination_eth_resolved TEXT,
                                                 case_uuid TEXT REFERENCES case_details (case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_ARP_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS arp (
                                   arp_uuid TEXT PRIMARY KEY,
                                   arp_src_hw_mac TEXT,
                                   arp_src_proto_ipv4 TEXT,
                                   arp_dst_hw_mac TEXT,
                                   arp_dst_proto_ipv4 TEXT,
                                   case_uuid TEXT REFERENCES case_details (case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  )
`;

export const GET_ALL_HOSTS_DATA_PAGEABLE = `SELECT * FROM hosts ORDER BY host_uuid DESC LIMIT ? OFFSET ?; `;
export const GET_ALL_SSDP_DATA_PAGEABLE = `SELECT * FROM ssdp LIMIT ? OFFSET ? `;
export const GET_ALL_ARP_DATA_PAGEABLE = `SELECT * FROM arp LIMIT ? OFFSET ? `;
export const GET_ALL_SSDP_DATA = `SELECT * FROM ssdp`;
export const GET_ALL_HTTP_HEADERS = `SELECT * FROM http_headers`;
export const GET_ALL_HTTP = `SELECT * FROM http`;
export const GET_ALL_OPEN_PORTS = `SELECT * FROM openPorts`;
export const GET_ALL_CONNECTIONS = `SELECT * FROM connections`;
export const GET_CASE_DETAILS =  `SELECT * FROM case_details`
export const GET_dnsSmbLdapServers =  `SELECT * FROM dnsSmbLdapServers`


