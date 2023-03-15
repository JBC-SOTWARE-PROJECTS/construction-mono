
-- inventory.return_supplier definition

-- Drop table

-- DROP TABLE inventory.return_supplier;

CREATE TABLE inventory.return_supplier (
	id uuid NOT NULL,
	rts_no varchar NULL,
	return_date timestamp NULL,
	ref_srr varchar NULL,
	received_ref_no varchar NULL,
	received_ref_date timestamp NULL,
	office uuid NULL,
	supplier uuid NULL,
	received_by varchar NULL,
	return_by varchar NULL,
	return_user uuid NULL,
	is_posted bool NULL,
	is_void bool NULL,


	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT return_supplier_pkey PRIMARY KEY (id)
);


-- inventory.return_supplier_items definition

-- Drop table

-- DROP TABLE inventory.return_supplier_items;

CREATE TABLE inventory.return_supplier_items (
	id uuid NOT NULL,
	return_supplier uuid NULL,
	item uuid NULL,
	return_qty int4 NULL,
	return_unit_cost numeric NULL,
	return_remarks text NULL,
	is_posted bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT return_supplier_items_pkey PRIMARY KEY (id)
);


-- inventory.return_supplier foreign keys

ALTER TABLE inventory.return_supplier ADD CONSTRAINT return_supplier_office_fkey FOREIGN KEY (office) REFERENCES office(id);
ALTER TABLE inventory.return_supplier ADD CONSTRAINT return_supplier_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier(id);


-- inventory.return_supplier_items foreign keys

ALTER TABLE inventory.return_supplier_items ADD CONSTRAINT return_supplier_items_item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);
ALTER TABLE inventory.return_supplier_items ADD CONSTRAINT return_supplier_items_return_supplier_fkey FOREIGN KEY (return_supplier) REFERENCES inventory.return_supplier(id);