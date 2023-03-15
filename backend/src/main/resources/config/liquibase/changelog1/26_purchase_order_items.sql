DROP TABLE IF EXISTS inventory.purchase_order_items;

CREATE TABLE inventory.purchase_order_items (
	id uuid NOT NULL,
	purchase_order uuid NULL,
	item uuid NOT NULL,
	quantity numeric NULL DEFAULT 0,
	unit_cost numeric NULL DEFAULT 0,
	pr_nos varchar NULL,
	qty_in_small int4 NULL DEFAULT 0,
	"type" varchar NULL,
	type_text varchar NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
    deleted bool NULL,

	CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id)
);