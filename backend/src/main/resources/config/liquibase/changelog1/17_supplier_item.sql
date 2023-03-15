-- inventory.supplier_item definition

-- Drop table

-- DROP TABLE inventory.supplier_item;

CREATE TABLE inventory.supplier_item (
	id uuid NOT NULL,
	supplier uuid NULL,
	item_id uuid NULL,
	"cost" numeric NULL,

	created_by varchar NULL,
	created_date timestamp NULL,
	last_modified_by varchar NULL,
	last_modified_date timestamp NULL,
	deleted bool NULL DEFAULT false
);