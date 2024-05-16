CREATE SCHEMA IF NOT EXISTS nfmvt;


CREATE TABLE IF NOT EXISTS case_details (
                                          case_uuid VARCHAR(36) PRIMARY KEY,
                                          case_number VARCHAR(15) UNIQUE NOT NULL,
                                          case_investigator_name VARCHAR(255) NOT NULL,
                                          case_status ENUM('Active', 'Closed') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CREATE INDEX idx_case_number (case_number),
  CREATE INDEX idx_case_investigator_name (case_investigator_name),
  CREATE INDEX idx_case_status (case_status),
  CREATE INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS case_files (
                                        file_uuid VARCHAR(36) PRIMARY KEY,
                                        file_case_number VARCHAR(15) NOT NULL,
                                        file_path VARCHAR(255) NOT NULL,
                                        file_name VARCHAR(255) NOT NULL,
                                        file_size BIGINT NOT NULL,
                                        file_md5sum VARCHAR(32) NOT NULL,
                                        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        FOREIGN KEY (file_case_number) REFERENCES case_details(case_number) ON DELETE CASCADE ON UPDATE CASCADE,
                                        CREATE INDEX idx_file_case_number (file_case_number),
  CREATE INDEX idx_file_path (file_path),
  CREATE INDEX idx_file_name (file_name),
  CREATE INDEX idx_uploaded_at (uploaded_at)
);

CREATE TABLE IF NOT EXISTS http_headers (
                                          http_header_uuid VARCHAR(36) PRIMARY KEY,
                                          http_host VARCHAR(255),
                                          http_method VARCHAR(10),
                                          http_uri VARCHAR(255),
                                          http_user_agent VARCHAR(255),
                                          http_referer VARCHAR(255),
                                          http_response_code INT,
                                          http_content_type VARCHAR(255),
                                          file_uuid VARCHAR(36),
                                          FOREIGN KEY (file_uuid) REFERENCES case_files(file_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
                                          CREATE INDEX idx_file_uuid (file_uuid),
  CREATE INDEX idx_http_host (http_host),
  CREATE INDEX idx_http_method (http_method),
  CREATE INDEX idx_http_uri (http_uri),
  CREATE INDEX idx_http_user_agent (http_user_agent),
  CREATE INDEX idx_http_referer (http_referer)
  CREATE INDEX idx_http_response_code (http_response_code),
  CREATE INDEX idx_http_content_type (http_content_type)
);

CREATE TABLE IF NOT EXISTS http_requests (
                                           http_request_uuid VARCHAR(36) PRIMARY KEY,
                                           http_request_source_ip VARCHAR(15) NOT NULL,
                                           http_request_destination_ip VARCHAR(15) NOT NULL,
                                           http_request_method VARCHAR(10) NOT NULL,
                                           http_request_uri VARCHAR(255) NOT NULL,
                                           http_request_protocol VARCHAR(10) NOT NULL,
                                           http_request_status_code INT,
                                           http_request_content_type VARCHAR(255),
                                           file_uuid VARCHAR(36),
                                           FOREIGN KEY (file_uuid) REFERENCES case_files(file_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
                                           INDEX idx_file_uuid (file_uuid),
  INDEX idx_http_request_source_ip (http_request_source_ip),
  INDEX idx_http_request_destination_ip (http_request_destination_ip),
  INDEX idx_http_request_method (http_request_method),
  INDEX idx_http_request_uri (http_request_uri),
  INDEX idx_http_request_protocol (http_request_protocol),
  INDEX idx_http_request_status_code (http_request_status_code),
  INDEX idx_http_request_content_type (http_request_content_type)
);

CREATE TABLE IF NOT EXISTS http_all_requests (
                                               http_all_request_uuid VARCHAR(36) PRIMARY KEY,
                                               http_all_request_frame_number INT NOT NULL,
                                               http_all_request_source_ip VARCHAR(15) NOT NULL,
                                               http_all_request_destination_ip VARCHAR(15) NOT NULL,
                                               http_all_request_source_port INT NOT NULL,
                                               http_all_request_destination_port INT NOT NULL,
                                               http_all_request_request_method VARCHAR(10) NOT NULL,
                                               http_all_request_host VARCHAR(255),
                                               http_all_request_user_agent VARCHAR(255),
                                               http_all_request_referer VARCHAR(255),
                                               http_all_request_status_code INT ,
                                               http_all_request_content_type VARCHAR(255),
                                               http_all_request_cookie VARCHAR(255),
                                               http_all_request_request_uri VARCHAR(255),
                                               http_all_request_server VARCHAR(255),
                                               http_all_request_content_length INT,
                                               http_all_request_transfer_encoding VARCHAR(50),
                                               http_all_request_cache_control VARCHAR(255),
                                               http_all_request_authorization VARCHAR(255),
                                               http_all_request_location VARCHAR(255),
                                               http_all_request_connection VARCHAR(50),
                                               file_uuid VARCHAR(36),
                                               FOREIGN KEY (file_uuid) REFERENCES case_files(file_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
                                               INDEX idx_file_uuid (file_uuid),
  INDEX idx_http_all_request_frame_number (http_all_request_frame_number),
  INDEX idx_http_all_request_source_ip (http_all_request_source_ip),
  INDEX idx_http_all_request_destination_ip (http_all_request_destination_ip),
  INDEX idx_http_all_request_source_port (http_all_request_source_port),
  INDEX idx_http_all_request_destination_port (http_all_request_destination_port),
  INDEX idx_http_all_request_request_method (http_all_request_request_method),
  INDEX idx_http_all_request_status_code (http_all_request_status_code)
);

CREATE TABLE IF NOT EXISTS udp_requests (
                                          udp_request_uuid VARCHAR(36) PRIMARY KEY,
                                          udp_request_source_ip VARCHAR(15) NOT NULL,
                                          udp_request_destination_ip VARCHAR(15) NOT NULL,
                                          udp_request_protocol VARCHAR(10) NOT NULL ,
                                          udp_request_method VARCHAR(10) NOT NULL,
                                          udp_request_uri VARCHAR(255) NOT NULL ,
                                          udp_request_status_code INT,
                                          file_uuid VARCHAR(36),
                                          FOREIGN KEY (file_uuid) REFERENCES case_files(file_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
                                          CREATE INDEX idx_file_uuid (file_uuid),
  CREATE INDEX idx_udp_request_source_ip (udp_request_source_ip),
  CREATE INDEX idx_udp_request_destination_ip (udp_request_destination_ip),
  CREATE INDEX idx_udp_request_protocol (udp_request_protocol),
  CREATE INDEX idx_udp_request_method (udp_request_method),
  CREATE INDEX idx_udp_request_uri (udp_request_uri),
  CREATE INDEX idx_udp_request_status_code (udp_request_status_code)
);

CREATE TABLE IF NOT EXISTS open_ports (
                                        open_port_uuid VARCHAR(36) PRIMARY KEY,
                                        open_port_source_ip VARCHAR(15) NOT NULL,
                                        open_port_destination_port INT NOT NULL,
                                        open_port_initial_rtt INT NOT NULL,
                                        open_port_window_size_value INT NOT NULL,
                                        open_port_tcp_options_mss VARCHAR(10) NOT NULL,
                                        file_uuid VARCHAR(36),
                                        FOREIGN KEY (file_uuid) REFERENCES case_files(file_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
                                        CREATE INDEX idx_file_uuid (file_uuid),
  CREATE INDEX idx_open_port_source_ip (open_port_source_ip),
  CREATE INDEX idx_open_port_destination_port (open_port_destination_port),
  CREATE INDEX idx_open_port_initial_rtt (open_port_initial_rtt),
  CREATE INDEX idx_open_port_window_size_value (open_port_window_size_value),
  CREATE INDEX idx_open_port_tcp_options_mss (open_port_tcp_options_mss)
);


CREATE TABLE IF NOT EXISTS ip_conversations (
                                              ip_conversation_uuid VARCHAR(36) PRIMARY KEY,
                                              ip_conversation_source_ip VARCHAR(15) NOT NULL,
                                              ip_conversation_destination_ip VARCHAR(15) NOT NULL,
                                              ip_conversation_frames_to_source INT NOT NULL,
                                              ip_conversation_bytes_to_source BIGINT NOT NULL,
                                              ip_conversation_frames_to_destination INT NOT NULL,
                                              ip_conversation_bytes_to_destination BIGINT NOT NULL,
                                              ip_conversation_total_frames INT NOT NULL,
                                              ip_conversation_total_bytes BIGINT NOT NULL,
                                              ip_conversation_start_time FLOAT NOT NULL,
                                              ip_conversation_duration FLOAT NOT NULL,
                                              file_uuid VARCHAR(36),
                                              FOREIGN KEY (file_uuid) REFERENCES case_files(file_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
                                              CREATE INDEX idx_file_uuid (file_uuid),
  CREATE INDEX idx_ip_conversation_source_ip (ip_conversation_source_ip),
  CREATE INDEX idx_ip_conversation_destination_ip (ip_conversation_destination_ip),
  CREATE INDEX idx_ip_conversation_total_frames (ip_conversation_total_frames),
  CREATE INDEX idx_ip_conversation_start_time (ip_conversation_start_time),
  CREATE INDEX idx_ip_conversation_duration (ip_conversation_duration)
);

CREATE TABLE IF NOT EXISTS dns_smb_ldap_servers (
                                                  dns_smb_ldap_server_uuid VARCHAR(36) PRIMARY KEY,
                                                  dns_smb_ldap_server_frame_number INT NOT NULL,
                                                  dns_smb_ldap_server_frame_time TIMESTAMP NOT NULL,
                                                  dns_smb_ldap_server_source_ip VARCHAR(15) NOT NULL,
                                                  dns_smb_ldap_server_destination_ip VARCHAR(15) NOT NULL,
                                                  dns_smb_ldap_server_dns_query VARCHAR(255),
                                                  dns_smb_ldap_server_dns_response VARCHAR(255),
                                                  dns_smb_ldap_server_dhcp_message VARCHAR(255),
                                                  dns_smb_ldap_server_ldap_message VARCHAR(255),
                                                  file_uuid VARCHAR(36),
                                                  FOREIGN KEY (file_uuid) REFERENCES case_files(file_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
                                                  CREATE INDEX idx_file_uuid (file_uuid),
  CREATE INDEX idx_dns_smb_ldap_server_frame_number (dns_smb_ldap_server_frame_number),
  CREATE INDEX idx_dns_smb_ldap_server_frame_time (dns_smb_ldap_server_frame_time),
  CREATE INDEX idx_dns_smb_ldap_server_source_ip (dns_smb_ldap_server_source_ip),
  CREATE INDEX idx_dns_smb_ldap_server_destination_ip (dns_smb_ldap_server_destination_ip)
);

CREATE TABLE IF NOT EXISTS arp_requests (
                                          arp_request_uuid VARCHAR(36) PRIMARY KEY,
                                          arp_request_source_hw_mac VARCHAR(17) NOT NULL,
                                          arp_request_source_proto_ipv4 VARCHAR(15) NOT NULL,
                                          arp_request_destination_hw_mac VARCHAR(17) NOT NULL,
                                          arp_request_destination_proto_ipv4 VARCHAR(15) NOT NULL,
                                          file_uuid VARCHAR(36),
                                          FOREIGN KEY (file_uuid) REFERENCES case_files(file_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
                                          CREATE INDEX idx_file_uuid (file_uuid),
  CREATE INDEX idx_arp_request_source_hw_mac (arp_request_source_hw_mac),
  CREATE INDEX idx_arp_request_source_proto_ipv4 (arp_request_source_proto_ipv4),
  CREATE INDEX idx_arp_request_destination_hw_mac (arp_request_destination_hw_mac),
  CREATE INDEX idx_arp_request_destination_proto_ipv4 (arp_request_destination_proto_ipv4)
);

CREATE TABLE IF NOT EXISTS hosts (
                                   host_uuid VARCHAR(36) PRIMARY KEY,
                                   host_source_ip VARCHAR(15) NOT NULL,
                                   host_source_eth_mac VARCHAR(17) NOT NULL,
                                   host_source_eth_resolved VARCHAR(255) NOT NULL,
                                   host_destination_ip VARCHAR(15) NOT NULL ,
                                   host_destination_eth_mac VARCHAR(17) NOT NULL,
                                   host_destination_eth_resolved VARCHAR(255) NOT NULL,
                                   file_uuid VARCHAR(36),
                                   FOREIGN KEY (file_uuid) REFERENCES case_files(file_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
                                   CREATE INDEX idx_file_uuid (file_uuid),
  CREATE INDEX idx_host_source_ip (host_source_ip),
  CREATE INDEX idx_host_source_eth_mac (host_source_eth_mac),
  CREATE INDEX idx_host_source_eth_resolved (host_source_eth_resolved),
  CREATE INDEX idx_host_destination_ip (host_destination_ip),
  CREATE INDEX idx_host_destination_eth_mac (host_destination_eth_mac),
  CREATE INDEX idx_host_destination_eth_resolved (host_destination_eth_resolved)
);
