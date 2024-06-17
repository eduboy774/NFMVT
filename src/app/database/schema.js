export const CREATE_CASE_FILE_IF_NOT_EXISTS = `
  CREATE TABLE IF NOT EXISTS case_files(
     case_file_uuid TEXT PRIMARY KEY,
     case_uuid TEXT NOT NULL REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
     case_file_name TEXT,
     case_file_size TEXT,
     case_file_type TEXT,
     case_file_extension TEXT,
     case_file_md5_hash TEXT,
     case_file_upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     UNIQUE (case_uuid) -- Unique constraint on case_uuid
  )
`;

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
`;

export const CREATE_HOSTS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS hosts(
     host_uuid TEXT PRIMARY KEY,
     ip_address TEXT,
     resolved_name TEXT,
     case_uuid TEXT REFERENCES case_details (case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_CONNECTIONS_TABLE_IF_NOT_EXISTS = `
  CREATE TABLE IF NOT EXISTS connections(
    connection_uuid TEXT PRIMARY KEY,
    src_ip TEXT,
    dst_ip TEXT,
    frames_sent INTEGER,
    bytes_sent TEXT,
    frames_received INTEGER,
    bytes_received TEXT,
    total_frames INTEGER,
    total_bytes TEXT,
    start_time REAL,
    duration REAL,
    case_uuid TEXT REFERENCES case_details (case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_CONNECTIONS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS connections(
     host_uuid TEXT PRIMARY KEY,
     host_source_ip TEXT,
     host_source_eth_mac TEXT,
     host_source_eth_resolved TEXT,
     host_destination_ip TEXT,
     host_destination_eth_mac TEXT,
     host_destination_eth_resolved TEXT,
     case_uuid TEXT REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_ARP_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS arp(
     arp_uuid TEXT PRIMARY KEY,
     arp_src_hw_mac TEXT,
     arp_src_proto_ipv4 TEXT,
     arp_dst_hw_mac TEXT,
     arp_dst_proto_ipv4 TEXT,
     case_uuid TEXT REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_TABLE_IF_NOT_EXISTS_CASE_DETAILS = `
    CREATE TABLE IF NOT EXISTS case_details(
      case_uuid VARCHAR(36) PRIMARY KEY,
      case_number VARCHAR(15) UNIQUE NOT NULL,
      case_description VARCHAR(255) NOT NULL,
      case_investigator_name VARCHAR(50) NOT NULL,
      case_investigator_organization VARCHAR(50) NOT NULL,
      case_status VARCHAR(10) NOT NULL CHECK(case_status IN ('Active', 'Closed')) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_case_uuid ON case_details (case_uuid);
    CREATE INDEX IF NOT EXISTS idx_case_number ON case_details (case_number);
    CREATE INDEX IF NOT EXISTS idx_case_investigator_name ON case_details (case_investigator_name);
    CREATE INDEX IF NOT EXISTS idx_case_investigator_organization ON case_details (case_investigator_organization);
    CREATE INDEX IF NOT EXISTS idx_case_status ON case_details (case_status);
    CREATE INDEX IF NOT EXISTS idx_created_at ON case_details (created_at);
  `;

export const CREATE_OPEN_PORTS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS open_ports(
    open_port_uuid TEXT PRIMARY KEY,
    src_ip TEXT,
    dst_port INTEGER,
    initial_rtt REAL,
    window_size INTEGER,
    mss INTEGER,
    case_uuid TEXT NOT NULL REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_DNS_SMB_LDAP_SERVERS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS dns_smb_ldap_servers(
    server_uuid TEXT PRIMARY KEY,
    frame_number INTEGER,
    frame_time TEXT,
    src_ip TEXT,
    dst_ip TEXT,
    dns TEXT,
    dhcp TEXT,
    ldap TEXT,
    case_uuid TEXT NOT NULL REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_HTTP_EVERYTHING_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS http_everything(
    http_uuid TEXT PRIMARY KEY,
    frame_number INTEGER,
    src_ip TEXT,
    dst_ip TEXT,
    src_port INTEGER,
    dst_port INTEGER,
    method TEXT,
    host TEXT,
    user_agent TEXT,
    referer TEXT,
    response_code INTEGER,
    content_type TEXT,
    cookie TEXT,
    uri TEXT,
    server TEXT,
    content_length INTEGER,
    transfer_encoding TEXT,
    cache_control TEXT,
    authorization TEXT,
    location TEXT,
    connection TEXT,
    case_uuid TEXT NOT NULL REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_HTTP_HEADERS_TABLE_IF_NOT_EXIST = `
  CREATE TABLE IF NOT EXISTS http_headers (
    http_header_uuid TEXT PRIMARY KEY,
    src_ip TEXT,
    dst_ip TEXT,
    host TEXT,
    method TEXT,
    uri TEXT,
    user_agent TEXT,
    referer TEXT,
    response_code INTEGER,
    content_type TEXT,
    case_uuid TEXT NOT NULL REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export const CREATE_HTTP_REQUESTS_TABLE_IF_NOT_EXISTS = `
  CREATE TABLE IF NOT EXISTS http_requests (
    http_uuid TEXT PRIMARY KEY,
    frame_number INTEGER,
    src_mac TEXT,
    dst_mac TEXT,
    src_ip TEXT,
    dst_ip TEXT,
    src_port INTEGER,
    dst_port INTEGER,
    method TEXT,
    uri TEXT,
    request_version TEXT,
    host TEXT,
    user_agent TEXT,
    full_request_uri TEXT,
    response_version TEXT,
    status_code INTEGER,
    response_phrase TEXT,
    server TEXT,
    content_type TEXT,
    content_length INTEGER,
    last_modified TEXT,
    time_since_request REAL,
    request_frame INTEGER,
    case_uuid TEXT NOT NULL REFERENCES case_details(case_uuid) ON DELETE CASCADE ON UPDATE CASCADE
);

`;

export const GET_CASE_DETAILS = `SELECT * FROM case_details`;
export const GET_CASE_FILES = `SELECT * FROM case_files`;

export const GET_ALL_HOSTS_DATA = `SELECT * FROM hosts WHERE case_uuid = ?`;
export const GET_ALL_HOSTS_DATA_PAGEABLE = `SELECT * FROM hosts WHERE case_uuid = ? LIMIT ? OFFSET ?;`;

export const GET_ALL_SSDP_DATA = `SELECT * FROM ssdp WHERE case_uuid = ?`;
export const GET_ALL_SSDP_DATA_PAGEABLE = `SELECT * FROM ssdp WHERE case_uuid = ? LIMIT ? OFFSET ?`;

export const GET_ALL_ARP = `SELECT * FROM arp WHERE case_uuid = ?`;
export const GET_ALL_ARP_DATA_PAGEABLE = `SELECT * FROM arp WHERE case_uuid = ? LIMIT ? OFFSET ?`;

export const GET_ALL_CONNECTIONS = `SELECT * FROM connections WHERE case_uuid = ?`;
export const GET_ALL_CONNECTIONS_DATA_PAGEABLE = `SELECT * FROM connections WHERE case_uuid = ? LIMIT ? OFFSET ?`;

export const GET_ALL_HTTP_REQUESTS = `SELECT * FROM http_requests WHERE case_uuid = ?`;
export const GET_ALL_HTTP_REQUESTS_PAGEABLE = `SELECT * FROM http_requests WHERE case_uuid = ? LIMIT ? OFFSET ?`;

export const GET_ALL_HTTP_EVERYTHING = `SELECT * FROM http_everything WHERE case_uuid = ?`;
export const GET_ALL_HTTP_EVERYTHING_PAGEABLE = `SELECT * FROM http_everything WHERE case_uuid = ? LIMIT ? OFFSET ?`;

export const GET_ALL_HTTP_HEADERS = `SELECT * FROM http_headers WHERE case_uuid = ?`;
export const GET_ALL_HTTP_HEADERS_PAGEABLE = `SELECT * FROM http_headers WHERE case_uuid = ? LIMIT ? OFFSET ?`;

export const GET_ALL_DNS_SMB_LDAP_SERVERS = `SELECT * FROM dns_smb_ldap_servers WHERE case_uuid = ?`;
export const GET_ALL_DNS_SMB_LDAP_SERVERS_PAGEABLE = `SELECT * FROM dns_smb_ldap_servers WHERE case_uuid = ? LIMIT ? OFFSET ?`;

export const GET_ALL_OPEN_PORTS = `SELECT * FROM open_ports WHERE case_uuid = ?`;
export const GET_ALL_OPEN_PORTS_PAGEABLE = `SELECT * FROM open_ports WHERE case_uuid = ? LIMIT ? OFFSET ?`;

export const GET_SIMPLE_REPORT = `
SELECT
    case_details.case_number,
    case_details.case_description,
    case_details.case_investigator_name,
    case_details.case_investigator_organization,
    case_details.case_status,
    case_details.created_at,
    (SELECT COUNT(*) FROM ssdp WHERE ssdp.case_uuid = case_details.case_uuid) AS no_of_ssdp,
    (SELECT COUNT(*) FROM hosts WHERE hosts.case_uuid = case_details.case_uuid) AS no_of_hosts,
    --(SELECT COUNT(*) FROM arp WHERE arp.case_uuid = case_details.case_uuid) AS no_of_arp,
    (SELECT COUNT(*) FROM dns_smb_ldap_servers WHERE dns_smb_ldap_servers.case_uuid = case_details.case_uuid) AS no_of_dns_smb_ldap_servers,
    (SELECT COUNT(*) FROM http_headers WHERE http_headers.case_uuid = case_details.case_uuid) AS no_of_http_headers,
    --(SELECT COUNT(*) FROM http_everything WHERE http_everything.case_uuid = case_details.case_uuid) AS no_of_http_everything,
    (SELECT COUNT(*) FROM open_ports WHERE open_ports.case_uuid = case_details.case_uuid) AS no_of_open_ports,
    (SELECT COUNT(*) FROM connections WHERE connections.case_uuid = case_details.case_uuid) AS no_of_connections
FROM
    case_details;
`;


export const GET_GENERAL_STATICTICS = `
SELECT
    case_details.case_number,
    case_details.case_description,
    case_details.case_investigator_name,
    case_details.case_investigator_organization,
    case_details.case_status,
    case_details.created_at,
    (SELECT COUNT(*) FROM ssdp WHERE ssdp.case_uuid = case_details.case_uuid) AS no_of_ssdp,
    (SELECT COUNT(*) FROM hosts WHERE hosts.case_uuid = case_details.case_uuid) AS no_of_hosts,
    --(SELECT COUNT(*) FROM arp WHERE arp.case_uuid = case_details.case_uuid) AS no_of_arp,
    (SELECT COUNT(*) FROM dns_smb_ldap_servers WHERE dns_smb_ldap_servers.case_uuid = case_details.case_uuid) AS no_of_dns_smb_ldap_servers,
    (SELECT COUNT(*) FROM http_headers WHERE http_headers.case_uuid = case_details.case_uuid) AS no_of_http_headers,
    --(SELECT COUNT(*) FROM http_everything WHERE http_everything.case_uuid = case_details.case_uuid) AS no_of_http_everything,
    (SELECT COUNT(*) FROM open_ports WHERE open_ports.case_uuid = case_details.case_uuid) AS no_of_open_ports,
    (SELECT COUNT(*) FROM connections WHERE connections.case_uuid = case_details.case_uuid) AS no_of_connections
FROM
    case_details 
    WHERE case_uuid = ?
    ;
`;
