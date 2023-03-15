create schema billing;
CREATE TABLE billing.customer (
	id uuid NOT NULL,
	fullname varchar NULL,
	customer_type varchar NULL,
	address varchar NULL,
	tel_no varchar NULL,
	email_add varchar NULL,
	contact_person varchar NULL,
	contact_person_num varchar NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT customer_pkey PRIMARY KEY (id)
);