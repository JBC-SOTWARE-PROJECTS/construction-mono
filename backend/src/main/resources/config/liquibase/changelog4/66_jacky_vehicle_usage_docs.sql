-- asset.asset_maintenance_type definition

-- Drop table

-- DROP TABLE job.asset_maintenance_type;

CREATE TABLE asset.vehicle_usage_docs (
	id uuid NOT NULL,
	doc_type varchar,
	description varchar,
	file varchar,
	item uuid,
	vehicle_usage uuid,
	company uuid,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT vehicle_usage_docs_pkey PRIMARY KEY (id)
);





ALTER TABLE asset.vehicle_usage_docs ADD CONSTRAINT item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);
ALTER TABLE asset.vehicle_usage_docs ADD CONSTRAINT vehicle_usage_fkey FOREIGN KEY (vehicle_usage) REFERENCES asset.vehicle_usage_monitoring(id);
ALTER TABLE asset.vehicle_usage_docs ADD CONSTRAINT company_fkey FOREIGN KEY (company) REFERENCES public.company(id);



