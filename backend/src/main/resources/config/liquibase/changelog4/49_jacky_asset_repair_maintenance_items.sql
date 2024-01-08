

CREATE TABLE asset.asset_repair_maintenance_items (
	id uuid NOT NULL,
	quantity numeric NULL,
	base_price numeric NULL,
	company uuid,
	asset_repair_maintenance uuid,
	item uuid,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT asset_repair_maintenance_item_pkey PRIMARY KEY (id)
);

ALTER TABLE asset.asset_repair_maintenance_items ADD CONSTRAINT item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);
ALTER TABLE asset.asset_repair_maintenance_items ADD CONSTRAINT asset_repair_maintenance_fkey FOREIGN KEY (asset_repair_maintenance) REFERENCES asset.asset_repair_maintenance(id);



