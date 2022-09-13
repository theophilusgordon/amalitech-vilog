CREATE TABLE confirmation_code(
  confirmation_code_uuid UUID NOT NULL PRIMARY KEY,
  code VARCHAR(255)
);

CREATE TABLE admins(
  admin_uuid UUID NOT NULL PRIMARY KEY,
  admin_profile_pic VARCHAR(255),
  admin_email VARCHAR(255) UNIQUE NOT NULL,
  admin_phone VARCHAR(255) UNIQUE NOT NULL,
  admin_first_name VARCHAR(255) NOT NULL,
  admin_last_name VARCHAR(255) NOT NULL,
  admin_company VARCHAR(255),
  admin_password VARCHAR(255) NOT NULL,
  admin_confirmation_code_id UUID REFERENCES confirmation_code (confirmation_code_uuid) 
);

CREATE TABLE hosts(
  host_uuid UUID NOT NULL PRIMARY KEY,
  host_profile_pic VARCHAR(255),
  host_email VARCHAR(255) UNIQUE NOT NULL,
  host_phone VARCHAR(255) UNIQUE NOT NULL,
  host_first_name VARCHAR(255) NOT NULL,
  host_last_name VARCHAR(255) NOT NULL,
  host_company VARCHAR(255),
  host_password VARCHAR(255) NOT NULL DEFAULT '1234',
  host_confirmation_code_id UUID REFERENCES confirmation_code (confirmation_code_uuid) 
);

CREATE TABLE guests(
  guest_uuid UUID NOT NULL PRIMARY KEY,
  guest_profile_pic VARCHAR(255),
  guest_email VARCHAR(255) UNIQUE NOT NULL,
  guest_phone VARCHAR(255) UNIQUE NOT NULL,
  guest_first_name VARCHAR(255) NOT NULL,
  guest_last_name VARCHAR(255) NOT NULL,
  guest_company VARCHAR(255),
  guest_host_id UUID REFERENCES hosts(host_uuid)
);



CREATE TABLE visit_logs(
  visit_log_uuid UUID NOT NULL PRIMARY KEY,
  sign_in TIMESTAMP,
  sign_out TIMESTAMP,
  guest_id UUID REFERENCES guests(guest_uuid)
);

CREATE TABLE qr_code(
  qr_code_uuid UUID NOT NULL PRIMARY KEY, 
  guest_id UUID REFERENCES guests(guest_uuid),
  disabled BOOLEAN
);