-- inventory.quantity_adjustment_type definition

-- Drop table

-- DROP TABLE inventory.quantity_adjustment_type;

CREATE TABLE inventory.quantity_adjustment_type (
	id uuid NOT NULL,
	code varchar NULL,
	description varchar NULL,
	is_active bool NULL,
	deleted bool NULL,
	deleted_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	flag_value varchar NULL,
	CONSTRAINT quantity_adjustment_type_pkey PRIMARY KEY (id)
);


-- inventory.signature_table definition

-- Drop table

-- DROP TABLE inventory.signature_table;

CREATE TABLE inventory.signature_table (
	id uuid NOT NULL,
	office_id uuid NULL,
	signature_type varchar NULL,
	"sequence" int4 NULL,
	signature_header varchar NULL,
	signature_person varchar NULL,
	signature_position varchar NULL,
	is_current_user bool NULL,

	deleted_by varchar(50) NULL,
	deleted_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT signature_table_pkey PRIMARY KEY (id)
);


-- inventory.quantity_adjustment definition

-- Drop table

-- DROP TABLE inventory.quantity_adjustment;

CREATE TABLE inventory.quantity_adjustment (
	id uuid NOT NULL,
	ref_num varchar NULL,
	date_trans timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	item uuid NULL,
	office uuid NULL,
	quantity int4 NULL,
	unit_cost numeric NULL DEFAULT 0,
	adjustment_type uuid NULL,
	remarks varchar NULL,
	is_posted bool NULL,
	is_cancel bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT quantity_adjustment_pkey PRIMARY KEY (id)
);


-- inventory.quantity_adjustment foreign keys

ALTER TABLE inventory.quantity_adjustment ADD CONSTRAINT quantity_adjustment_department_fkey FOREIGN KEY (office) REFERENCES office(id);
ALTER TABLE inventory.quantity_adjustment ADD CONSTRAINT quantity_adjustment_item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);