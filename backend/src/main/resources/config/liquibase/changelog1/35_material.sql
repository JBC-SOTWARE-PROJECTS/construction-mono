-- inventory.material_production definition

-- Drop table

-- DROP TABLE inventory.material_production;

CREATE TABLE inventory.material_production (
	id uuid NOT NULL,
	date_trans date NULL,
	mp_no varchar NULL,
	description varchar(255) NULL,

	office uuid NULL,
	produced_by uuid NULL,
	is_posted bool NULL DEFAULT false,
	is_void bool NULL DEFAULT false,
	status varchar NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT material_production_pkey PRIMARY KEY (id)
);


-- inventory.material_production_item definition

-- Drop table

-- DROP TABLE inventory.material_production_item;

CREATE TABLE inventory.material_production_item (
	id uuid NOT NULL,
	material_production uuid NULL,
	item uuid NULL,
	"type" varchar NULL,
	qty int4 NULL,
	unit_cost numeric NULL,
	is_posted bool NULL DEFAULT false,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT material_production_item_pkey PRIMARY KEY (id)
);