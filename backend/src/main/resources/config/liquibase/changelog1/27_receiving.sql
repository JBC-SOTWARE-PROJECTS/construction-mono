-- inventory.po_delivery_monitoring definition

-- Drop table

DROP TABLE IF EXISTS inventory.po_delivery_monitoring;

CREATE TABLE inventory.po_delivery_monitoring (
	id uuid NOT NULL,
	purchase_order_item uuid NULL,
	receiving uuid NULL,
	receiving_item uuid NULL,
	delivered_qty int4 NULL,
	delivery_status varchar NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,
	CONSTRAINT po_delivery_monitoring_pkey PRIMARY KEY (id)
);


-- inventory.receiving_report_items definition

-- Drop table

DROP TABLE IF EXISTS inventory.receiving_report_items;

CREATE TABLE inventory.receiving_report_items (
	id uuid NOT NULL,
	receiving_report uuid NULL,
	item uuid NULL,
	ref_poitem uuid NULL,
	rec_qty int4 NULL,
	rec_unit_cost numeric NULL,
	rec_disc_cost numeric NULL,
	is_fg bool NULL,
	is_discount bool NULL,
	is_completed bool NULL,
	is_partial bool NULL,
	is_posted bool NULL,

	expiration_date date NULL,
	is_tax bool NULL DEFAULT true,
	input_tax numeric NULL,
	total_amount numeric NULL,
	net_amount numeric NULL DEFAULT 0,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT receiving_report_items_pkey PRIMARY KEY (id)
);

-- inventory.receiving_report definition

-- Drop table

DROP TABLE IF EXISTS inventory.receiving_report;

CREATE TABLE inventory.receiving_report (
	id uuid NOT NULL,
	received_type varchar NULL,
	received_no varchar NULL,
	received_date timestamp NULL,
	purchase_order uuid NULL,
	received_ref_no varchar NULL,
	received_ref_date timestamp NULL,
	received_office uuid NOT NULL,
	supplier uuid NOT NULL,
	payment_terms uuid NOT NULL,
	received_remarks text NULL,

	fix_discount numeric NULL DEFAULT 0,
	gross_amount numeric NULL DEFAULT 0,
	total_discount numeric NULL DEFAULT 0,
	net_of_discount numeric NULL DEFAULT 0,
	amount numeric NULL DEFAULT 0,
	vat_rate numeric NULL DEFAULT 0,
	input_tax numeric NULL DEFAULT 0,
	net_amount numeric NULL DEFAULT 0,
	vat_inclusive bool NULL DEFAULT false,

	is_posted bool NULL,
	is_void bool NULL,

	user_id uuid NULL,
	user_fullname varchar NULL,
	acct_type uuid NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT receiving_report_pkey PRIMARY KEY (id)
);


-- inventory.po_delivery_monitoring foreign keys

ALTER TABLE inventory.po_delivery_monitoring ADD CONSTRAINT po_delivery_monitoring_purchase_order_item_fkey FOREIGN KEY (purchase_order_item) REFERENCES inventory.purchase_order_items(id);
ALTER TABLE inventory.po_delivery_monitoring ADD CONSTRAINT po_delivery_monitoring_receiving_fkey FOREIGN KEY (receiving) REFERENCES inventory.receiving_report(id);
ALTER TABLE inventory.po_delivery_monitoring ADD CONSTRAINT po_delivery_monitoring_receiving_item_fkey FOREIGN KEY (receiving_item) REFERENCES inventory.receiving_report_items(id);


-- inventory.receiving_report foreign keys

ALTER TABLE inventory.receiving_report ADD CONSTRAINT receiving_report_payment_terms_fkey FOREIGN KEY (payment_terms) REFERENCES inventory.payment_terms(id);
ALTER TABLE inventory.receiving_report ADD CONSTRAINT receiving_report_purchase_order_fkey FOREIGN KEY (purchase_order) REFERENCES inventory.purchase_order(id);
ALTER TABLE inventory.receiving_report ADD CONSTRAINT receiving_report_received_office_fkey FOREIGN KEY (received_office) REFERENCES office(id);
ALTER TABLE inventory.receiving_report ADD CONSTRAINT receiving_report_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier(id);


-- inventory.receiving_report_items foreign keys

ALTER TABLE inventory.receiving_report_items ADD CONSTRAINT receiving_report_items_item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);
ALTER TABLE inventory.receiving_report_items ADD CONSTRAINT receiving_report_items_receiving_report_fkey FOREIGN KEY (receiving_report) REFERENCES inventory.receiving_report(id);
ALTER TABLE inventory.receiving_report_items ADD CONSTRAINT receiving_report_items_ref_poitem_fkey FOREIGN KEY (ref_poitem) REFERENCES inventory.purchase_order_items(id);