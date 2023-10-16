CREATE TABLE IF NOT EXISTS accounting.integration_group (
	id uuid NOT NULL,
	company_id uuid NULL,
	description varchar(50) NULL,
	deleted bool NULL,
	deleted_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT integration_group_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS accounting.integration (
	id uuid NOT NULL,
	company_id uuid NULL,
	description varchar NULL,
	flag_property varchar NULL,
	flag_value varchar NULL,
	order_priority int4 NULL,
	created_by varchar NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	"domain" varchar NULL,
	integration_group uuid NULL,
	CONSTRAINT integration_pk PRIMARY KEY (id)
);
CREATE INDEX integration_domain_idx ON accounting.integration USING btree (domain);
CREATE INDEX integration_flag_value_idx ON accounting.integration USING btree (flag_value);
CREATE INDEX integration_integration_group_company_idx ON accounting.integration USING btree (integration_group,company_id);


CREATE TABLE accounting.integration_items (
	id uuid NOT NULL,
	integration uuid NULL,
	company_id uuid NULL,
	journal_account jsonb NULL,
	disabled_property varchar NULL,
	disabled_value varchar NULL,
	value_property varchar NULL,
	created_by varchar NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	source_column varchar NULL,
	multiple bool NULL,
	CONSTRAINT integration_items_pk PRIMARY KEY (id)
);
CREATE INDEX integration_integration_company_idx ON accounting.integration_items USING btree (integration,company_id);
ALTER TABLE accounting.integration_items ADD CONSTRAINT fk_integration_items_integration FOREIGN KEY (integration) REFERENCES accounting.integration(id) ON DELETE CASCADE ON UPDATE CASCADE;
