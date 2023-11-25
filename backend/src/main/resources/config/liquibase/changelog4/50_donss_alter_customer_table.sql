CREATE TABLE IF NOT EXISTS accounting.ar_payment_posting (
	id uuid NOT NULL,
	record_no varchar(100) NULL,

	payment_datetime timestamp NULL,
	or_number varchar(100) NULL,
	payment_tracker_id uuid NULL,
	invoice_id uuid NULL,
	invoice_no varchar NULL,

	customer_name varchar(100) NULL,
	customer_id uuid NULL,

	payment_amount numeric(15, 2) NULL,
	discount_amount numeric NULL,

	reference_cn uuid NULL,
	receipt_type varchar NULL,
	notes text NULL,

	status varchar(100) NOT NULL,

	created_by varchar(50) NULL,
    created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT ar_payment_posting_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS accounting.ar_payment_posting_details (
	id uuid NOT NULL,
	record_no varchar NULL,
	ar_payment_posting uuid NULL,

	or_number varchar NULL,
	payment_tracker_id uuid NULL,
	payment_datetime timestamp(6) NULL,

	invoice_id uuid NULL,
	invoice_no varchar NULL,
	invoice_item_id uuid NULL,

	customer_id uuid NULL,
	customer_name varchar(100) NOT NULL,

	description varchar NULL,
	amount_paid numeric(15, 2) NOT NULL,

	item_type varchar NULL,
	item_name varchar NULL,
	applied_discount numeric NULL,
	total_amount_due numeric NULL,
	reference varchar NULL,
	invoice_due_date date NULL,

	created_by varchar(50) NULL,
    created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT ar_payment_posting_details_pkey PRIMARY KEY (id)
);

ALTER TABLE cashier.payments
ADD COLUMN IF NOT EXISTS total_deposit numeric,
ADD COLUMN IF NOT EXISTS total_e_wallet numeric,
ADD COLUMN IF NOT EXISTS payor_name varchar,
ADD COLUMN IF NOT EXISTS ar_customer_id uuid,
ADD COLUMN IF NOT EXISTS posted_ledger_id uuid;

ALTER TABLE cashier.payments_details
ADD COLUMN IF NOT EXISTS bank_id uuid;
