-- accounting.reports_layout definition

-- Drop table

-- DROP TABLE accounting.reports_layout;

CREATE TABLE IF NOT EXISTS accounting.reports_layout (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	report_type varchar NULL,
	layout_name varchar NULL,
	title varchar NULL,
	is_active bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	config jsonb NULL DEFAULT '{}'::jsonb,

	company_id uuid,
	CONSTRAINT reports_layout_pkey PRIMARY KEY (id)
);
CREATE INDEX reports_layout_primary_condition_idx ON accounting.reports_layout USING btree (report_type, is_active, company_id);


-- accounting.reports_layout_item definition

-- Drop table

-- DROP TABLE accounting.reports_layout_item;

CREATE TABLE IF NOT EXISTS accounting.reports_layout_item (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	reports_layout_id uuid NULL,
	reports_layout_items_parent uuid NULL,
	order_no int4 NULL,
	title varchar NULL,
	code varchar NULL,
	account_name varchar NULL,
	normal_side varchar NULL,
	item_type varchar NULL,
	is_formula bool NULL,
	is_group bool NULL,
	has_total bool NULL,
	formula_groups jsonb NULL DEFAULT '[]'::jsonb,
	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	account jsonb NULL DEFAULT '{}'::jsonb,
	fields jsonb NULL DEFAULT '{}'::jsonb,
	company_id uuid,
	CONSTRAINT reports_layout_item_pkey PRIMARY KEY (id)
);
CREATE INDEX reports_layout_items_parent_condition_idx ON accounting.reports_layout_item USING btree (reports_layout_items_parent, company_id);
CREATE INDEX reports_layout_items_parent_condition_item_type_idx ON accounting.reports_layout_item USING btree (reports_layout_items_parent, item_type, is_group, company_id);
CREATE INDEX reports_layout_items_primary_condition_idx ON accounting.reports_layout_item USING btree (reports_layout_id, company_id);


-- accounting.save_accounts definition

-- Drop table

-- DROP TABLE accounting.save_accounts;

CREATE TABLE IF NOT EXISTS accounting.save_accounts (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	transaction_date date NULL,
	transaction_date_str varchar NULL,
	year_char int4 NULL,
	mother_code varchar NULL,
	sub_code varchar NULL,
	sub_sub_code varchar NULL,
	mother_account varchar NULL,
	sub_account varchar NULL,
	sub_sub_account varchar NULL,
	code varchar NULL,
	description varchar NULL,
	normal_side varchar NULL,
	debit numeric NULL,
	credit numeric NULL,
	balance numeric NULL,
	config jsonb NULL DEFAULT '{}'::jsonb,
	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	account_type varchar NULL,
	company_id uuid,
	CONSTRAINT save_accounts_pkey PRIMARY KEY (id)
);
CREATE INDEX save_accounts_sub_code_transaction_date_idx ON accounting.save_accounts USING btree (sub_code, transaction_date, company_id);
CREATE INDEX save_accounts_sub_sub_code_transaction_date_idx ON accounting.save_accounts USING btree (sub_sub_code, transaction_date, company_id);
CREATE INDEX save_accounts_transaction_date_idx ON accounting.save_accounts USING btree (transaction_date, company_id);
CREATE INDEX save_accounts_transaction_date_str_idx ON accounting.save_accounts USING btree (transaction_date_str, company_id);
CREATE INDEX save_accounts_year_char_idx ON accounting.save_accounts USING btree (year_char, company_id);