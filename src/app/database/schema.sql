CREATE SCHEMA IF NOT EXISTS nfmvt;

CREATE TABLE IF NOT EXISTS nfmvt.case_details (
                                                case_id VARCHAR(36) PRIMARY KEY,
                                                case_number VARCHAR(15) UNIQUE NOT NULL COMMENT 'Unique identifier for the case',
                                                case_investigator_name VARCHAR(255) NOT NULL COMMENT 'Name of the investigator handling the case',
                                                case_status ENUM('Active', 'Closed') NOT NULL DEFAULT 'Active' COMMENT 'Status of the case (Active or Closed)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp indicating when the case was created',
  INDEX idx_case_number (case_number),
  INDEX idx_case_investigator_name (case_investigator_name),
  INDEX idx_case_status (case_status),
  INDEX idx_created_at (created_at)
) COMMENT='Table to store details of cases under investigation';

CREATE TABLE IF NOT EXISTS nfmvt.case_files (
                                              file_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for the file',
                                              file_case_number VARCHAR(15) NOT NULL COMMENT 'Case number associated with the file',
                                              file_path VARCHAR(255) NOT NULL COMMENT 'Path of the file',
                                              file_name VARCHAR(255) NOT NULL COMMENT 'Name of the file',
                                              file_size BIGINT NOT NULL COMMENT 'Size of the file in bytes',
                                              file_md5sum VARCHAR(32) NOT NULL COMMENT 'MD5 hash sum of the file',
                                              uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp indicating when the file was uploaded',
                                              FOREIGN KEY (file_case_number) REFERENCES case_details(case_number) ON DELETE CASCADE ON UPDATE CASCADE,
                                              INDEX idx_file_case_number (file_case_number) COMMENT 'Index for the case number associated with the file',
  INDEX idx_file_path (file_path) COMMENT 'Index for the file path',
  INDEX idx_file_name (file_name) COMMENT 'Index for the file name',
  INDEX idx_uploaded_at (uploaded_at) COMMENT 'Index for the timestamp of file upload'
) COMMENT='Table to store details of files associated with cases';

CREATE TABLE IF NOT EXISTS nfmvt.http_headers (
                                                http_header_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for the HTTP header',
                                                http_host VARCHAR(255) COMMENT 'Host information from the HTTP header',
                                                http_method VARCHAR(10) COMMENT 'HTTP method used in the request',
                                                http_uri VARCHAR(255) COMMENT 'URI path from the HTTP header',
                                                http_user_agent VARCHAR(255) COMMENT 'User agent from the HTTP header',
                                                http_referer VARCHAR(255) COMMENT 'Referer information from the HTTP header',
                                                http_response_code INT COMMENT 'HTTP response code',
                                                http_content_type VARCHAR(255) COMMENT 'Content type from the HTTP header',
                                                file_id VARCHAR(36) COMMENT 'Foreign key referencing the file ID from case_files table',
                                                FOREIGN KEY (file_id) REFERENCES case_files(file_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                                INDEX idx_file_id (file_id) COMMENT 'Index for the file ID',
  INDEX idx_http_host (http_host) COMMENT 'Index for the HTTP host',
  INDEX idx_http_method (http_method) COMMENT 'Index for the HTTP method',
  INDEX idx_http_uri (http_uri) COMMENT 'Index for the HTTP URI',
  INDEX idx_http_user_agent (http_user_agent) COMMENT 'Index for the HTTP user agent',
  INDEX idx_http_referer (http_referer) COMMENT 'Index for the HTTP referer',
  INDEX idx_http_response_code (http_response_code) COMMENT 'Index for the HTTP response code',
  INDEX idx_http_content_type (http_content_type) COMMENT 'Index for the HTTP content type'
) COMMENT='Table to store HTTP header information associated with files';

CREATE TABLE IF NOT EXISTS nfmvt.http_requests (
                                                 http_request_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for the HTTP request',
                                                 http_request_source_ip VARCHAR(15) NOT NULL COMMENT 'Source IP address of the HTTP request',
                                                 http_request_destination_ip VARCHAR(15) NOT NULL COMMENT 'Destination IP address of the HTTP request',
                                                 http_request_method VARCHAR(10) NOT NULL COMMENT 'HTTP method used in the request',
                                                 http_request_uri VARCHAR(255) NOT NULL COMMENT 'URI path from the HTTP request',
                                                 http_request_protocol VARCHAR(10) NOT NULL COMMENT 'Protocol used in the HTTP request',
                                                 http_request_status_code INT COMMENT 'HTTP status code of the response',
                                                 http_request_content_type VARCHAR(255) COMMENT 'Content type of the HTTP request',
                                                 file_id VARCHAR(36) COMMENT 'Foreign key referencing the file ID from case_files table',
                                                 FOREIGN KEY (file_id) REFERENCES case_files(file_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                                 INDEX idx_file_id (file_id) COMMENT 'Index for the file ID',
  INDEX idx_http_request_source_ip (http_request_source_ip) COMMENT 'Index for the source IP address',
  INDEX idx_http_request_destination_ip (http_request_destination_ip) COMMENT 'Index for the destination IP address',
  INDEX idx_http_request_method (http_request_method) COMMENT 'Index for the HTTP method',
  INDEX idx_http_request_uri (http_request_uri) COMMENT 'Index for the HTTP URI',
  INDEX idx_http_request_protocol (http_request_protocol) COMMENT 'Index for the HTTP protocol',
  INDEX idx_http_request_status_code (http_request_status_code) COMMENT 'Index for the HTTP status code',
  INDEX idx_http_request_content_type (http_request_content_type) COMMENT 'Index for the HTTP content type'
) COMMENT='Table to store HTTP request information associated with files';

CREATE TABLE IF NOT EXISTS nfmvt.http_all_requests (
                                                     http_all_request_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for the HTTP request',
                                                     http_all_request_frame_number INT NOT NULL COMMENT 'Frame number of the HTTP request',
                                                     http_all_request_source_ip VARCHAR(15) NOT NULL COMMENT 'Source IP address of the HTTP request',
                                                     http_all_request_destination_ip VARCHAR(15) NOT NULL COMMENT 'Destination IP address of the HTTP request',
                                                     http_all_request_source_port INT NOT NULL COMMENT 'Source port of the HTTP request',
                                                     http_all_request_destination_port INT NOT NULL COMMENT 'Destination port of the HTTP request',
                                                     http_all_request_request_method VARCHAR(10) NOT NULL COMMENT 'HTTP method used in the request',
                                                     http_all_request_host VARCHAR(255) COMMENT 'Host information from the HTTP request',
                                                     http_all_request_user_agent VARCHAR(255) COMMENT 'User agent from the HTTP request',
                                                     http_all_request_referer VARCHAR(255) COMMENT 'Referer information from the HTTP request',
                                                     http_all_request_status_code INT COMMENT 'HTTP status code of the request',
                                                     http_all_request_content_type VARCHAR(255) COMMENT 'Content type of the HTTP request',
                                                     http_all_request_cookie VARCHAR(255) COMMENT 'Cookie information from the HTTP request',
                                                     http_all_request_request_uri VARCHAR(255) COMMENT 'URI path from the HTTP request',
                                                     http_all_request_server VARCHAR(255) COMMENT 'Server information from the HTTP request',
                                                     http_all_request_content_length INT COMMENT 'Content length of the HTTP request',
                                                     http_all_request_transfer_encoding VARCHAR(50) COMMENT 'Transfer encoding of the HTTP request',
                                                     http_all_request_cache_control VARCHAR(255) COMMENT 'Cache control information from the HTTP request',
                                                     http_all_request_authorization VARCHAR(255) COMMENT 'Authorization information from the HTTP request',
                                                     http_all_request_location VARCHAR(255) COMMENT 'Location information from the HTTP request',
                                                     http_all_request_connection VARCHAR(50) COMMENT 'Connection information from the HTTP request',
                                                     file_id VARCHAR(36) COMMENT 'Foreign key referencing the file ID from case_files table',
                                                     FOREIGN KEY (file_id) REFERENCES case_files(file_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                                     INDEX idx_file_id (file_id) COMMENT 'Index for the file ID',
  INDEX idx_http_all_request_frame_number (http_all_request_frame_number) COMMENT 'Index for the frame number',
  INDEX idx_http_all_request_source_ip (http_all_request_source_ip) COMMENT 'Index for the source IP address',
  INDEX idx_http_all_request_destination_ip (http_all_request_destination_ip) COMMENT 'Index for the destination IP address',
  INDEX idx_http_all_request_source_port (http_all_request_source_port) COMMENT 'Index for the source port',
  INDEX idx_http_all_request_destination_port (http_all_request_destination_port) COMMENT 'Index for the destination port',
  INDEX idx_http_all_request_request_method (http_all_request_request_method) COMMENT 'Index for the HTTP method',
  INDEX idx_http_all_request_status_code (http_all_request_status_code) COMMENT 'Index for the HTTP status code'
) COMMENT='Table to store all HTTP request information associated with files';

CREATE TABLE IF NOT EXISTS nfmvt.udp_requests (
                                                udp_request_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for the UDP request',
                                                udp_request_source_ip VARCHAR(15) NOT NULL COMMENT 'Source IP address of the UDP request',
                                                udp_request_destination_ip VARCHAR(15) NOT NULL COMMENT 'Destination IP address of the UDP request',
                                                udp_request_protocol VARCHAR(10) NOT NULL COMMENT 'Protocol used in the UDP request',
                                                udp_request_method VARCHAR(10) NOT NULL COMMENT 'Method used in the UDP request',
                                                udp_request_uri VARCHAR(255) NOT NULL COMMENT 'URI path from the UDP request',
                                                udp_request_status_code INT COMMENT 'Status code of the UDP request',
                                                file_id VARCHAR(36) COMMENT 'Foreign key referencing the file ID from case_files table',
                                                FOREIGN KEY (file_id) REFERENCES case_files(file_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                                INDEX idx_file_id (file_id) COMMENT 'Index for the file ID',
  INDEX idx_udp_request_source_ip (udp_request_source_ip) COMMENT 'Index for the source IP address',
  INDEX idx_udp_request_destination_ip (udp_request_destination_ip) COMMENT 'Index for the destination IP address',
  INDEX idx_udp_request_protocol (udp_request_protocol) COMMENT 'Index for the protocol',
  INDEX idx_udp_request_method (udp_request_method) COMMENT 'Index for the method',
  INDEX idx_udp_request_uri (udp_request_uri) COMMENT 'Index for the URI',
  INDEX idx_udp_request_status_code (udp_request_status_code) COMMENT 'Index for the status code'
) COMMENT='Table to store UDP request information associated with files';

CREATE TABLE IF NOT EXISTS nfmvt.open_ports (
                                              open_port_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for the open port',
                                              open_port_source_ip VARCHAR(15) NOT NULL COMMENT 'Source IP address of the open port',
                                              open_port_destination_port INT NOT NULL COMMENT 'Destination port of the open port',
                                              open_port_initial_rtt INT NOT NULL COMMENT 'Initial round-trip time of the open port',
                                              open_port_window_size_value INT NOT NULL COMMENT 'Window size value of the open port',
                                              open_port_tcp_options_mss VARCHAR(10) NOT NULL COMMENT 'TCP options MSS of the open port',
                                              file_id VARCHAR(36) COMMENT 'Foreign key referencing the file ID from case_files table',
                                              FOREIGN KEY (file_id) REFERENCES case_files(file_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                              INDEX idx_file_id (file_id) COMMENT 'Index for the file ID',
  INDEX idx_open_port_source_ip (open_port_source_ip) COMMENT 'Index for the source IP address',
  INDEX idx_open_port_destination_port (open_port_destination_port) COMMENT 'Index for the destination port',
  INDEX idx_open_port_initial_rtt (open_port_initial_rtt) COMMENT 'Index for the initial round-trip time',
  INDEX idx_open_port_window_size_value (open_port_window_size_value) COMMENT 'Index for the window size value',
  INDEX idx_open_port_tcp_options_mss (open_port_tcp_options_mss) COMMENT 'Index for the TCP options MSS'
) COMMENT='Table to store information about open ports associated with files';


CREATE TABLE IF NOT EXISTS nfmvt.ip_conversations (
                                                    ip_conversation_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for the IP conversation',
                                                    ip_conversation_source_ip VARCHAR(15) NOT NULL COMMENT 'Source IP address of the IP conversation',
                                                    ip_conversation_destination_ip VARCHAR(15) NOT NULL COMMENT 'Destination IP address of the IP conversation',
                                                    ip_conversation_frames_to_source INT NOT NULL COMMENT 'Frames sent to the source IP',
                                                    ip_conversation_bytes_to_source BIGINT NOT NULL COMMENT 'Bytes sent to the source IP',
                                                    ip_conversation_frames_to_destination INT NOT NULL COMMENT 'Frames sent to the destination IP',
                                                    ip_conversation_bytes_to_destination BIGINT NOT NULL COMMENT 'Bytes sent to the destination IP',
                                                    ip_conversation_total_frames INT NOT NULL COMMENT 'Total frames in the IP conversation',
                                                    ip_conversation_total_bytes BIGINT NOT NULL COMMENT 'Total bytes in the IP conversation',
                                                    ip_conversation_start_time FLOAT NOT NULL COMMENT 'Start time of the IP conversation',
                                                    ip_conversation_duration FLOAT NOT NULL COMMENT 'Duration of the IP conversation',
                                                    file_id VARCHAR(36) COMMENT 'Foreign key referencing the file ID from case_files table',
                                                    FOREIGN KEY (file_id) REFERENCES case_files(file_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                                    INDEX idx_file_id (file_id) COMMENT 'Index for the file ID',
  INDEX idx_ip_conversation_source_ip (ip_conversation_source_ip) COMMENT 'Index for the source IP address',
  INDEX idx_ip_conversation_destination_ip (ip_conversation_destination_ip) COMMENT 'Index for the destination IP address',
  INDEX idx_ip_conversation_total_frames (ip_conversation_total_frames) COMMENT 'Index for the total frames',
  INDEX idx_ip_conversation_start_time (ip_conversation_start_time) COMMENT 'Index for the start time',
  INDEX idx_ip_conversation_duration (ip_conversation_duration) COMMENT 'Index for the duration'
) COMMENT='Table to store IP conversation information associated with files';

CREATE TABLE IF NOT EXISTS nfmvt.dns_smb_ldap_servers (
                                                        dns_smb_ldap_server_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for DNS, SMB, or LDAP server',
                                                        dns_smb_ldap_server_frame_number INT NOT NULL COMMENT 'Frame number of the server',
                                                        dns_smb_ldap_server_frame_time TIMESTAMP NOT NULL COMMENT 'Timestamp of the frame',
                                                        dns_smb_ldap_server_source_ip VARCHAR(15) NOT NULL COMMENT 'Source IP address of the server',
                                                        dns_smb_ldap_server_destination_ip VARCHAR(15) NOT NULL COMMENT 'Destination IP address of the server',
                                                        dns_smb_ldap_server_dns_query VARCHAR(255) COMMENT 'DNS query',
                                                        dns_smb_ldap_server_dns_response VARCHAR(255) COMMENT 'DNS response',
                                                        dns_smb_ldap_server_dhcp_message VARCHAR(255) COMMENT 'DHCP message',
                                                        dns_smb_ldap_server_ldap_message VARCHAR(255) COMMENT 'LDAP message',
                                                        file_id VARCHAR(36) COMMENT 'Foreign key referencing the file ID from case_files table',
                                                        FOREIGN KEY (file_id) REFERENCES case_files(file_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                                        INDEX idx_file_id (file_id) COMMENT 'Index for the file ID',
  INDEX idx_dns_smb_ldap_server_frame_number (dns_smb_ldap_server_frame_number) COMMENT 'Index for the frame number',
  INDEX idx_dns_smb_ldap_server_frame_time (dns_smb_ldap_server_frame_time) COMMENT 'Index for the frame time',
  INDEX idx_dns_smb_ldap_server_source_ip (dns_smb_ldap_server_source_ip) COMMENT 'Index for the source IP address',
  INDEX idx_dns_smb_ldap_server_destination_ip (dns_smb_ldap_server_destination_ip) COMMENT 'Index for the destination IP address'
) COMMENT='Table to store information about DNS, SMB, or LDAP servers associated with files';

CREATE TABLE IF NOT EXISTS nfmvt.arp_requests (
                                                arp_request_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for ARP request',
                                                arp_request_source_hw_mac VARCHAR(17) NOT NULL COMMENT 'Source hardware MAC address of the ARP request',
                                                arp_request_source_proto_ipv4 VARCHAR(15) NOT NULL COMMENT 'Source protocol IPv4 address of the ARP request',
                                                arp_request_destination_hw_mac VARCHAR(17) NOT NULL COMMENT 'Destination hardware MAC address of the ARP request',
                                                arp_request_destination_proto_ipv4 VARCHAR(15) NOT NULL COMMENT 'Destination protocol IPv4 address of the ARP request',
                                                file_id VARCHAR(36) COMMENT 'Foreign key referencing the file ID from case_files table',
                                                FOREIGN KEY (file_id) REFERENCES case_files(file_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                                INDEX idx_file_id (file_id) COMMENT 'Index for the file ID',
  INDEX idx_arp_request_source_hw_mac (arp_request_source_hw_mac) COMMENT 'Index for the source hardware MAC address',
  INDEX idx_arp_request_source_proto_ipv4 (arp_request_source_proto_ipv4) COMMENT 'Index for the source protocol IPv4 address',
  INDEX idx_arp_request_destination_hw_mac (arp_request_destination_hw_mac) COMMENT 'Index for the destination hardware MAC address',
  INDEX idx_arp_request_destination_proto_ipv4 (arp_request_destination_proto_ipv4) COMMENT 'Index for the destination protocol IPv4 address'
) COMMENT='Table to store information about ARP requests associated with files';

CREATE TABLE IF NOT EXISTS nfmvt.hosts (
                                         host_id VARCHAR(36) PRIMARY KEY COMMENT 'Unique identifier for host',
                                         host_source_ip VARCHAR(15) NOT NULL COMMENT 'Source IP address of the host',
                                         host_source_eth_mac VARCHAR(17) NOT NULL COMMENT 'Source Ethernet MAC address of the host',
                                         host_source_eth_resolved VARCHAR(255) NOT NULL COMMENT 'Resolved Source Ethernet MAC address of the host',
                                         host_destination_ip VARCHAR(15) NOT NULL COMMENT 'Destination IP address of the host',
                                         host_destination_eth_mac VARCHAR(17) NOT NULL COMMENT 'Destination Ethernet MAC address of the host',
                                         host_destination_eth_resolved VARCHAR(255) NOT NULL COMMENT 'Resolved Destination Ethernet MAC address of the host',
                                         file_id VARCHAR(36) COMMENT 'Foreign key referencing the file ID from case_files table',
                                         FOREIGN KEY (file_id) REFERENCES case_files(file_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                         INDEX idx_file_id (file_id) COMMENT 'Index for the file ID',
  INDEX idx_host_source_ip (host_source_ip) COMMENT 'Index for the source IP address',
  INDEX idx_host_source_eth_mac (host_source_eth_mac) COMMENT 'Index for the source Ethernet MAC address',
  INDEX idx_host_source_eth_resolved (host_source_eth_resolved) COMMENT 'Index for the resolved source Ethernet MAC address',
  INDEX idx_host_destination_ip (host_destination_ip) COMMENT 'Index for the destination IP address',
  INDEX idx_host_destination_eth_mac (host_destination_eth_mac) COMMENT 'Index for the destination Ethernet MAC address',
  INDEX idx_host_destination_eth_resolved (host_destination_eth_resolved) COMMENT 'Index for the resolved destination Ethernet MAC address'
) COMMENT='Table to store information about hosts associated with files';
