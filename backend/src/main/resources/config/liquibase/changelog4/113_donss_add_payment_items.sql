DROP VIEW IF EXISTS cashier.payment_items;

CREATE TABLE IF NOT EXISTS cashier.payment_items (
	id uuid NOT NULL,
	record_no varchar NULL,
	item_name varchar NULL,
	description varchar NULL,
	unit varchar NULL,
	qty int4 NULL,
	price numeric(15, 2) NULL,
	vat numeric(15, 2) NULL,
	vat_exempt numeric(15, 2) NULL,
	vat_zero_rated_sales numeric(15, 2) NULL,
	discount numeric(15, 2) NULL,
	withholding_tax numeric(15, 2) NULL,
	amount numeric(15, 2) NULL,
	is_pf bool NULL,
	reference_item_type varchar NULL,
	reference_item_id uuid NULL,
	payment_tracker_id uuid NULL,
	is_voided bool NULL,
	deleted bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX payment_items_parent_id ON cashier.payment_items USING btree (payment_tracker_id);
CREATE INDEX payment_items_reference_id ON cashier.payment_items USING btree (reference_item_id);