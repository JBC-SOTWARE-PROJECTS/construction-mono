-- billing.billing definition

-- Drop table

-- DROP TABLE billing.billing;

CREATE TABLE billing.billing (
	id uuid NOT NULL,
	date_trans timestamp NULL DEFAULT now(),
	bill_no varchar NULL,
	job uuid NULL,
	customer uuid NULL,
	otc_name varchar NULL,
	"locked" bool NULL,
	locked_by varchar NULL,
	status bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT billing_pkey PRIMARY KEY (id)
);


-- billing.billing_item definition

-- Drop table

-- DROP TABLE billing.billing_item;

CREATE TABLE billing.billing_item (
	id uuid NOT NULL,
	trans_date timestamp NULL DEFAULT now(),
	billing uuid NULL,
	record_no varchar NULL,
	description varchar NULL,
	qty int4 NULL,
	debit numeric NULL,
	credit numeric NULL,
	sub_total numeric NULL,
	item_type varchar NULL,
	trans_type varchar NULL,
	credit_payment numeric NULL,
	or_num varchar(500) NULL,
	status bool NULL,
	item uuid NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT billing_item_pkey PRIMARY KEY (id)
);


-- billing.discount_details definition

-- Drop table

-- DROP TABLE billing.discount_details;

CREATE TABLE billing.discount_details (

	id uuid NOT NULL,
	billing_item uuid NULL,
	ref_billing_item uuid NULL,
	billing uuid NULL,
	discount_amount numeric NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT discount_details_pkey PRIMARY KEY (id)
);


-- billing.billing foreign keys

ALTER TABLE billing.billing ADD CONSTRAINT billing_customer_fkey FOREIGN KEY (customer) REFERENCES billing.customer(id);
ALTER TABLE billing.billing ADD CONSTRAINT billing_job_fkey FOREIGN KEY (job) REFERENCES billing.jobs(id);


-- billing.billing_item foreign keys

ALTER TABLE billing.billing_item ADD CONSTRAINT billing_item_billing_fkey FOREIGN KEY (billing) REFERENCES billing.billing(id);


-- billing.discount_details foreign keys

ALTER TABLE billing.discount_details ADD CONSTRAINT discount_details_billing_fkey FOREIGN KEY (billing) REFERENCES billing.billing(id);
ALTER TABLE billing.discount_details ADD CONSTRAINT discount_details_billing_item_fkey FOREIGN KEY (billing_item) REFERENCES billing.billing_item(id);
ALTER TABLE billing.discount_details ADD CONSTRAINT discount_details_ref_billing_item_fkey FOREIGN KEY (ref_billing_item) REFERENCES billing.billing_item(id);