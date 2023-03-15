DROP TABLE IF EXISTS billing.service_category;
CREATE TABLE billing.service_category (
	id uuid PRIMARY KEY NOT NULL,
	code varchar NULL,
	description varchar NULL,
	is_active bool NULL,

	deleted_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL
);