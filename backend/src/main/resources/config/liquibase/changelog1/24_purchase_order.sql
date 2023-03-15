
CREATE TABLE inventory.purchase_order (
	id uuid NOT NULL,
	po_number varchar NULL,
	prepared_date timestamp NULL,
    eta_date timestamp NULL,
    supplier uuid NULL,
	payment_terms uuid NULL,
    pr_nos varchar NULL,
    office uuid NULL,
	remarks varchar NULL,
	is_approve bool NULL,
	status varchar NULL,
	user_id uuid NULL,
	prepared_by varchar NULL,
    no_pr bool NULL,
    is_completed bool NULL DEFAULT false,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
    deleted bool NULL,

	CONSTRAINT purchase_order_pkey PRIMARY KEY (id)
);


-- inventory.purchase_order_items definition

-- Drop table

-- DROP TABLE inventory.purchase_order_items;

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
	CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id)
);