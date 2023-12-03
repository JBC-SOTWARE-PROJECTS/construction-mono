CREATE TABLE accounting.ar_transaction_ledger (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	record_no varchar NULL,
	ar_customers uuid NULL,
	ar_invoice_id uuid NULL,
	ar_credit_note_id uuid NULL,
	ar_payment_id uuid NULL,
	ledger_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	doc_date date NULL,
	doc_type varchar NULL,
	doc_no varchar NULL,
	total_cwt_amount numeric NULL,
	total_vat_amount numeric NULL,
	total_amount_due numeric NULL,
	remaining_balance numeric NULL,
	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	ar_promissory_id uuid NULL,
	reference_no varchar NULL,
	reference_type varchar NULL,
	CONSTRAINT ar_transaction_ledger_pkey PRIMARY KEY (id)
);
CREATE INDEX ar_transaction_ledger_ar_credit_note_id_index ON accounting.ar_transaction_ledger USING btree (ar_credit_note_id);
CREATE INDEX ar_transaction_ledger_ar_customers_index ON accounting.ar_transaction_ledger USING btree (ar_customers);
CREATE INDEX ar_transaction_ledger_ar_invoice_id_index ON accounting.ar_transaction_ledger USING btree (ar_invoice_id);
CREATE INDEX ar_transaction_ledger_ar_payment_id_index ON accounting.ar_transaction_ledger USING btree (ar_payment_id);
CREATE INDEX ar_transaction_ledger_deleted_index ON accounting.ar_transaction_ledger USING btree (deleted);