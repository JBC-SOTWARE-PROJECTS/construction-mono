
-- inventory.purchase_request definition

-- Drop table

-- DROP TABLE inventory.purchase_request;

CREATE TABLE inventory.purchase_request (
	id uuid NOT NULL,
	pr_no varchar NULL,
	pr_date_requested timestamp NULL,
	pr_date_needed timestamp NULL,
	supplier uuid NULL,
	user_id uuid NOT NULL,
	user_fullname varchar NULL,
	requesting_office uuid NOT NULL,
	pr_type varchar NULL,
	is_approve bool NULL,
	status varchar NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT purchase_request_pkey PRIMARY KEY (id)
);


-- inventory.purchase_request foreign keys
ALTER TABLE inventory.purchase_request ADD CONSTRAINT purchase_request_requesting_office_fkey FOREIGN KEY (requesting_office) REFERENCES office(id);
ALTER TABLE inventory.purchase_request ADD CONSTRAINT purchase_request_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier(id);


-- inventory.purchase_request_items definition

-- Drop table

-- DROP TABLE inventory.purchase_request_items;

CREATE TABLE inventory.purchase_request_items (
	id uuid NOT NULL,
	purchase_request uuid NULL,
	item uuid NULL,
	ref_po uuid NULL,
	requested_qty int4 NULL,
	on_hand_qty int4 NULL,
	remarks varchar NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT purchase_request_items_pkey PRIMARY KEY (id)
);


-- inventory.purchase_request_items foreign keys

ALTER TABLE inventory.purchase_request_items ADD CONSTRAINT purchase_request_items_item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);
ALTER TABLE inventory.purchase_request_items ADD CONSTRAINT purchase_request_items_purchase_request_fkey FOREIGN KEY (purchase_request) REFERENCES inventory.purchase_request(id);