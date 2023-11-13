CREATE TABLE accounting.ar_invoice (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	invoice_no varchar NULL,
	ar_customers uuid NULL,
	due_date date NULL,
	invoice_date date NULL,
	invoice_type varchar NULL,
	discount_amount numeric NULL,
	is_cwt bool NULL DEFAULT false,
	is_vatable bool NULL DEFAULT false,
	cwt_amount numeric NULL,
	vat_amount numeric NULL,
	total_amount_due numeric NULL,
	total_credit_note numeric NULL,
	total_payments numeric NULL,
	reference varchar NULL,
	notes text NULL,
	status varchar NULL,
	ledger_id uuid NULL,
	approved_by uuid NULL,
	approved_date timestamp(6) NULL,
	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	cwt_rate numeric NULL,
	billing_address text NULL,
	CONSTRAINT ar_invoice_pkey PRIMARY KEY (id)
);
CREATE INDEX ar_invoice_customer_index ON accounting.ar_invoice USING btree (ar_customers);
CREATE INDEX ar_invoice_deleted_index ON accounting.ar_invoice USING btree (deleted);


CREATE TABLE accounting.ar_invoice_items (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	record_no varchar NULL,
	invoice_no varchar NULL,
	ar_invoice_id uuid NULL,
	ar_customers uuid NULL,
	item_name varchar NULL,
	description varchar NULL,
	item_type varchar NULL,
	unit_price numeric NULL,
	quantity int4 NULL,
	discount numeric NULL,
	discount_amount numeric NULL,
	is_cwt bool NULL DEFAULT false,
	is_vatable bool NULL DEFAULT false,
	cwt_amount numeric NULL,
	vat_amount numeric NULL,
	total_amount_due numeric NULL,
	credit_note numeric NULL,
	payment numeric NULL,
	billing_no varchar NULL,
	soa_no varchar NULL,
	approval_code varchar NULL,
	billing_item_id uuid NULL,
	billing_id uuid NULL,
	cwt_rate numeric NULL,
    transaction_date date NULL,
    invoice_particulars uuid NULL,
	reference_transfer_id uuid NULL,
	status varchar NULL,

	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT ar_invoice_items_pkey PRIMARY KEY (id)
);
CREATE INDEX ar_invoice_items_billing_id_index ON accounting.ar_invoice_items USING btree (billing_id);
CREATE INDEX ar_invoice_items_billing_item_id_index ON accounting.ar_invoice_items USING btree (billing_item_id);
CREATE INDEX ar_invoice_items_customer_index ON accounting.ar_invoice_items USING btree (ar_customers);
CREATE INDEX ar_invoice_items_invoice_index ON accounting.ar_invoice_items USING btree (ar_invoice_id);
CREATE INDEX ar_invoice_items_reference_transfer_id_index ON accounting.ar_invoice_items USING btree (reference_transfer_id);

CREATE TABLE accounting.ar_invoice_particulars (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	item_code varchar NULL,
	item_name varchar NULL,
	description varchar NULL,
	item_category varchar NULL,
	cost_price numeric NULL,
	sale_price numeric NULL,
	sales_account varchar NULL,
	is_active bool NULL DEFAULT true,
	other_fields jsonb NULL DEFAULT '{}'::jsonb,
	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT ar_invoice_particulars_pkey PRIMARY KEY (id)
);