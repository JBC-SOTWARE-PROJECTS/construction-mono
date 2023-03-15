DROP TABLE IF EXISTS billing.charge_invoice;
CREATE TABLE billing.charge_invoice (
	id uuid PRIMARY KEY NOT NULL,
	billing uuid not null,
	description varchar NULL,
	content  bytea null,
	content_type varchar NULL,

	deleted_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL
);