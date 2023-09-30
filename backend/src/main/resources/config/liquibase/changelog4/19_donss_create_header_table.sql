CREATE TABLE accounting.header_ledger_group (
	id uuid NOT NULL,
	entity_name varchar NULL,
	particulars varchar NULL,
	fiscal uuid NULL,
	transaction_date timestamp NULL,
	journal_type varchar NULL,
	beginning_balance bool NULL,
	created_by varchar NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT ledger_header_group_pkey PRIMARY KEY (id)
);

CREATE TABLE accounting.header_ledger (
	id uuid NOT NULL,
	entity_name varchar NULL,
	particulars varchar NULL,
	doctype varchar NULL,
	docnum varchar NULL,
	reference_num varchar NULL,
	reference_type varchar NULL,
	fiscal uuid NULL,
	transaction_date timestamp NULL,
	journal_type varchar NULL,
	custom bool NULL,
	header_ledger_group_id uuid NULL,
	beginning_balance bool NULL,
	invoice_soa_reference varchar NULL,
	reversal bool NULL,
	reapply_payment_tracker uuid NULL,
	approved_by varchar NULL,
	approved_datetime timestamp NULL,
	transaction_date_only date NULL,

	created_by varchar NULL,
    created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar NULL,
    last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT ledgerheader_pkey PRIMARY KEY (id)
);
CREATE INDEX docnum_idx ON accounting.header_ledger USING btree (docnum,company_id);
CREATE INDEX entity_name_idx ON accounting.header_ledger USING btree (entity_name,company_id);
CREATE INDEX header_ledger_approved_datetime_idx ON accounting.header_ledger USING btree (approved_datetime,company_id);
CREATE INDEX header_ledger_beginning_balance_idx ON accounting.header_ledger USING btree (beginning_balance,company_id);
CREATE INDEX header_ledger_reapply_payment_tracker_idx ON accounting.header_ledger USING btree (reapply_payment_tracker,company_id);
CREATE INDEX idx_ledgerheaderorigdate ON accounting.header_ledger USING btree (transaction_date,company_id);
CREATE INDEX idxlhfiscal ON accounting.header_ledger USING btree (fiscal,company_id);
CREATE INDEX idxparentledger ON accounting.header_ledger USING btree (parent_ledger,company_id);
CREATE INDEX invoice_soa_reference_idx ON accounting.header_ledger USING btree (invoice_soa_reference,company_id);
CREATE INDEX journal_type_idx ON accounting.header_ledger USING btree (journal_type,company_id);
CREATE INDEX particulars_idx ON accounting.header_ledger USING btree (particulars,company_id);


-- accounting.header_ledger_old foreign keys

ALTER TABLE accounting.header_ledger_old ADD CONSTRAINT fk1_header_ledger FOREIGN KEY (fiscal) REFERENCES accounting.fiscals(id) ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE accounting.header_ledger_details (
	id uuid NULL,
    company_id uuid NULL,
	field_name varchar NULL,
	field_value varchar NULL,
	header_ledger uuid NULL
);

CREATE TABLE accounting.ledger (
	id uuid NOT NULL,
    company_id uuid NULL,
	credit numeric(15, 2) NULL,
	debit numeric(15, 2) NULL,
	particulars varchar NULL,
	"header" uuid NULL,
	created_by varchar NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	journal_account jsonb NULL,
	transaction_date_only date NULL,
	CONSTRAINT general_ledger_pkey PRIMARY KEY (id)
);
CREATE INDEX header_idx ON accounting.ledger USING btree (header,company_id);
CREATE INDEX ledger_journal_account_idx ON accounting.ledger USING btree (journal_account,company_id);

CREATE TABLE accounting.ledger_details (
	id uuid NOT NULL,
    company_id uuid NULL,
	field_name varchar NULL,
	field_value varchar NULL,
	general_ledger uuid NULL
);
CREATE INDEX general_ledger_gregg_idx ON accounting.ledger_details USING btree (field_name, field_value, general_ledger, company_id);
CREATE INDEX idx_field_name_genledger ON accounting.ledger_details USING btree (field_name, general_ledger,company_id);
CREATE INDEX idx_field_name_value ON accounting.ledger_details USING btree (field_name, field_value,company_id);
CREATE INDEX idx_general_ledger ON accounting.ledger_details USING btree (general_ledger,company_id);
CREATE INDEX idx_gl_field_name ON accounting.ledger_details USING btree (field_name,company_id);
CREATE INDEX idx_gl_field_value ON accounting.ledger_details USING btree (field_value,company_id);

ALTER TABLE accounting.ledger_details ADD CONSTRAINT fk_general_ledger_details_ledger FOREIGN KEY (general_ledger) REFERENCES accounting.ledger(id) ON DELETE CASCADE ON UPDATE CASCADE;