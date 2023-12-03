CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE accounting.ar_customers (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	account_prefix varchar NULL,
	account_no varchar NULL,
	"name" varchar NULL,
	address varchar NULL,
	"type" varchar NULL,
	discount_and_penalties jsonb NULL,
	other_details jsonb NULL DEFAULT '{}'::jsonb,
	client_info jsonb NULL DEFAULT '{}'::jsonb,

	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT ar_customers_pkey PRIMARY KEY (id)
);
