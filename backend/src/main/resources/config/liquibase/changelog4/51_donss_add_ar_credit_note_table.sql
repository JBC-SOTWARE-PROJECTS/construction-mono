-- accounting.ar_credit_note definition

-- Drop table

-- DROP TABLE accounting.ar_credit_note;

CREATE TABLE IF NOT EXISTS accounting.ar_credit_note (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	credit_note_no varchar NULL,
	ar_customers uuid NULL,
	credit_note_date date NULL,
	credit_note_type varchar NULL,
	discount_percentage numeric NULL,
	discount_amount numeric NULL,
	is_cwt bool NULL,
	is_vatable bool NULL,
	total_cwt_amount numeric NULL,
	total_vat_amount numeric NULL,
	total_amount_due numeric NULL,
	reference varchar NULL,
	notes text NULL,
	status varchar NULL,
	ledger_id uuid NULL,
	approved_by uuid NULL,
	approved_date timestamp(6) NULL,

	cwt_rate numeric NULL,
	billing_address varchar NULL,
	invoice_type varchar NULL,
	created_by varchar(50) NULL,
    created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50) NULL,
    last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
    deleted bool NULL,
	CONSTRAINT ar_credit_note_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS ar_credit_note_approved_by_index ON accounting.ar_credit_note USING btree (approved_by);
CREATE INDEX IF NOT EXISTS ar_credit_note_customer_index ON accounting.ar_credit_note USING btree (ar_customers);
CREATE INDEX IF NOT EXISTS ar_credit_note_deleted_index ON accounting.ar_credit_note USING btree (deleted);
CREATE INDEX IF NOT EXISTS ar_credit_note_ledger_id_index ON accounting.ar_credit_note USING btree (ledger_id);


-- accounting.ar_credit_note_allocated_invoice definition

-- Drop table

-- DROP TABLE accounting.ar_credit_note_allocated_invoice;

CREATE TABLE IF NOT EXISTS accounting.ar_credit_note_allocated_invoice (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	credit_note_no varchar NULL,
	date_applied date NULL,
	ar_customer uuid NULL,
	ar_credit_note_id uuid NULL,
	invoice_id uuid NULL,
	invoice_amount_due numeric NULL,
	amount_allocate numeric NULL,
	status varchar NULL,
	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	pn_id uuid NULL,
	CONSTRAINT ar_credit_note_allocated_invoice_pkey PRIMARY KEY (id)
);


-- accounting.ar_credit_note_items definition

-- Drop table

-- DROP TABLE accounting.ar_credit_note_items;

CREATE TABLE IF NOT EXISTS accounting.ar_credit_note_items (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	record_no varchar NULL,
	credit_note_no varchar NULL,

	ar_credit_note_id uuid NULL,
	ar_customers uuid NULL,
	ar_invoice uuid NULL,

	invoice_particulars uuid NULL,
	recipient_customer uuid NULL,
	discount_department uuid NULL,

	ar_invoice_no varchar NULL,
	ar_invoice_item_id uuid NULL,
	ar_invoice_item_record_no varchar NULL,

	item_name varchar NULL,
	description varchar NULL,
	item_type varchar NULL,

	unit_price numeric NULL,
	quantity int4 NULL,

	discount_percentage numeric NULL,
	discount_amount numeric NULL,

	is_cwt bool NULL,
	cwt_rate numeric NULL,
	is_vatable bool NULL,

	total_cwt_amount numeric NULL,
	total_vat_amount numeric NULL,
	total_amount_due numeric NULL,

	recipient_invoice uuid NULL,
	sales_account varchar NULL,
	reference varchar NULL,
	status varchar NULL,

	created_by varchar(50) NULL,
    created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50) NULL,
    last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
    deleted bool NULL,
	CONSTRAINT ar_credit_note_items_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS ar_credit_note_items_credit_note_index ON accounting.ar_credit_note_items USING btree (ar_credit_note_id);
CREATE INDEX IF NOT EXISTS ar_credit_note_items_customer_index ON accounting.ar_credit_note_items USING btree (ar_customers);
CREATE INDEX IF NOT EXISTS ar_credit_note_items_invoice_index ON accounting.ar_credit_note_items USING btree (ar_invoice);
CREATE INDEX IF NOT EXISTS ar_credit_note_items_invoice_item_index ON accounting.ar_credit_note_items USING btree (ar_invoice_item_id);
CREATE INDEX IF NOT EXISTS ar_credit_note_items_recipient_invoice_index ON accounting.ar_credit_note_items USING btree (recipient_invoice);

ALTER TABLE accounting.ar_credit_note_items
ADD COLUMN IF NOT EXISTS account_code jsonb NULL default '{}'::jsonb;