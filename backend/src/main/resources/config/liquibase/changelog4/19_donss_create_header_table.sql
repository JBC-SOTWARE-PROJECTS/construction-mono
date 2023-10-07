CREATE TABLE IF NOT EXISTS accounting.header_ledger_group (
	id uuid NOT NULL,
    company_id uuid NULL,
	record_no varchar NULL,
	entity_name varchar NULL,
	particulars varchar NULL,
	reference_id varchar NULL,
	fiscal uuid NULL,

	created_by varchar NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT ledger_header_group_pkey PRIMARY KEY (id)
);

CREATE INDEX company_id_idx ON accounting.header_ledger_group USING btree (company_id);

CREATE TABLE IF NOT EXISTS accounting.header_ledger (
	id uuid NOT NULL,
    company_id uuid NULL,
	header_ledger_group_id uuid NULL,
	entity_name varchar NULL,
	particulars varchar NULL,
	doctype varchar NULL,
	docnum varchar NULL,
	transaction_num varchar NULL,
    transaction_type varchar NULL,
	reference_num varchar NULL,
	reference_type varchar NULL,
	fiscal uuid NULL,
	transaction_date timestamp NULL,
	journal_type varchar NULL,
	custom bool NULL,
	beginning_balance bool NULL,
	reversal bool NULL,
	reapply_payment_tracker uuid NULL,
	approved_by varchar NULL,
	approved_datetime timestamp NULL,
	transaction_date_only date NULL,

	created_by varchar NULL,
    created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar NULL,
    last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT ledger_header_pkey PRIMARY KEY (id,transaction_date_only)
)
PARTITION BY RANGE (transaction_date_only);

CREATE INDEX idx_ledgerheaderorigdate ON accounting.header_ledger USING btree (transaction_date_only,company_id);
CREATE INDEX header_ledger_group_id_idx ON accounting.header_ledger USING btree (header_ledger_group_id);
CREATE INDEX transaction_date_only_header_ledger_group_id_idx ON accounting.header_ledger USING btree (transaction_date_only,header_ledger_group_id);

ALTER TABLE accounting.header_ledger ADD CONSTRAINT fk1_header_ledger FOREIGN KEY (fiscal) REFERENCES accounting.fiscals(id) ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS accounting.header_ledger_details (
	id uuid NULL,
    company_id uuid NULL,
	field_name varchar NULL,
	field_value varchar NULL,
	header_ledger uuid NULL
);

CREATE TABLE IF NOT EXISTS accounting.ledger (
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
	CONSTRAINT ledger_pkey PRIMARY KEY (id,transaction_date_only)
)
PARTITION BY RANGE (transaction_date_only);

CREATE INDEX header_idx ON accounting.ledger USING btree (header,company_id);
CREATE INDEX transaction_date_only_idx ON accounting.ledger USING btree (header,transaction_date_only);
CREATE INDEX ledger_journal_account_idx ON accounting.ledger USING btree (journal_account,transaction_date_only,company_id);

CREATE TABLE IF NOT EXISTS accounting.ledger_details (
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