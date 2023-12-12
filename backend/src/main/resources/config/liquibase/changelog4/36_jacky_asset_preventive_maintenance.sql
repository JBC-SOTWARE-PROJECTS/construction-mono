-- asset.asset_maintenance_type definition

-- Drop table

-- DROP TABLE job.asset_maintenance_type;

CREATE TABLE asset.asset_maintenance_types (
	id uuid NOT NULL,
	name varchar,
	description varchar NULL,
	company uuid,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT asset_maintenance_type_pkey PRIMARY KEY (id)
);



CREATE TABLE asset.asset_preventive_maintenance (
	id uuid NOT NULL,
	note varchar NULL,
	schedule_type varchar NULL,
	occurrence varchar NULL,
	reminder_schedule varchar NULL,

	asset uuid,
	asset_maintenance_type uuid,
	company uuid,

	deleted bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),

	CONSTRAINT asset_preventive_maintenance_pkey PRIMARY KEY (id)
);


-- asset.asset_preventive_maintenance foreign keys

ALTER TABLE asset.asset_preventive_maintenance ADD CONSTRAINT asset_maintenance_type_fkey FOREIGN KEY (asset_maintenance_type) REFERENCES asset.asset_maintenance_types(id);
ALTER TABLE asset.asset_preventive_maintenance ADD CONSTRAINT asset_fkey FOREIGN KEY (asset) REFERENCES asset.assets(id);



