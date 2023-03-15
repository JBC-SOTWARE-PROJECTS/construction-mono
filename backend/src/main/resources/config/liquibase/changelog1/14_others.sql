-- inventory.generics definition

-- Drop table

-- DROP TABLE inventory.generics;
CREATE SCHEMA inventory;

CREATE TABLE inventory.generics (
	id uuid NOT NULL,
	generic_code varchar NULL,
	generic_description varchar NULL,
	is_active bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT generics_pkey PRIMARY KEY (id)
);


-- inventory.item_groups definition

-- Drop table

-- DROP TABLE inventory.item_groups;

CREATE TABLE inventory.item_groups (
	id uuid NOT NULL,
	item_code varchar NULL,
	item_description varchar NULL,
	is_active bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT item_groups_pkey PRIMARY KEY (id)
);


-- inventory.payment_terms definition

-- Drop table

-- DROP TABLE inventory.payment_terms;

CREATE TABLE inventory.payment_terms (
	id uuid NOT NULL,
	payment_term_code varchar NULL,
	payment_term_description varchar NULL,
	payment_term_days int4 NULL,
	is_active bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT payment_terms_pkey PRIMARY KEY (id)
);



-- inventory.supplier_types definition

-- Drop table

-- DROP TABLE inventory.supplier_types;

CREATE TABLE inventory.supplier_types (
	id uuid NOT NULL,
	supplier_type_code varchar NULL,
	sup_sub_account_code varchar NULL,
	supplier_type_description varchar NULL,
	sup_ewt_rate int4 NULL,
	is_active bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT supplier_types_pkey PRIMARY KEY (id)
);


-- inventory.unit_measurements definition

-- Drop table

-- DROP TABLE inventory.unit_measurements;

CREATE TABLE inventory.unit_measurements (
	id uuid NOT NULL,
	unit_code varchar NULL,
	unit_description varchar NULL,
	is_small bool NULL,
	is_big bool NULL,
	is_active bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT unit_measurements_pkey PRIMARY KEY (id)
);


-- inventory.item_categories definition

-- Drop table

-- DROP TABLE inventory.item_categories;

CREATE TABLE inventory.item_categories (
	id uuid NOT NULL,
	fk_item_group uuid NOT NULL,
	category_code varchar NULL,
	category_description varchar NULL,
	is_active bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT item_categories_pkey PRIMARY KEY (id),
	CONSTRAINT item_categories_fk_item_group_fkey FOREIGN KEY (fk_item_group) REFERENCES inventory.item_groups(id)
);


-- inventory.supplier definition

-- Drop table

-- DROP TABLE inventory.supplier;

CREATE TABLE inventory.supplier (
	id uuid NOT NULL,
	supplier_code varchar NULL,
	supplier_fullname varchar NULL,
	supplier_tin varchar NULL,
	supplier_email varchar NULL,
	payment_terms uuid NOT NULL,
	supplier_entity varchar NULL,
	supplier_types uuid NOT NULL,
	credit_limit numeric NULL,
	is_vatable bool NULL,
	is_vat_inclusive bool NULL,
	remarks varchar NULL,
	lead_time int4 NULL,
	primary_address varchar NULL,
	primary_telphone varchar NULL,
	primary_contactperson varchar NULL,
	primary_fax varchar NULL,
	secondary_address varchar NULL,
	secondary_telphone varchar NULL,
	secondary_contactperson varchar NULL,
	secondary_fax varchar NULL,
	is_active bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT supplier_pkey PRIMARY KEY (id),
	CONSTRAINT supplier_payment_terms_fkey FOREIGN KEY (payment_terms) REFERENCES inventory.payment_terms(id),
	CONSTRAINT supplier_supplier_types_fkey FOREIGN KEY (supplier_types) REFERENCES inventory.supplier_types(id)
);