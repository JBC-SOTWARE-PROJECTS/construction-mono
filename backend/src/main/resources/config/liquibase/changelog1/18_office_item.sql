
CREATE TABLE inventory.office_item (
	id uuid NOT NULL,
	item uuid NOT NULL,
	office uuid NOT NULL,
	reorder_quantity numeric NULL,
	allow_trade bool NULL,
	is_assign bool NULL DEFAULT true,
	CONSTRAINT office_item_pkey PRIMARY KEY (id)
);
CREATE INDEX office_item_office_idx ON inventory.office_item USING btree (item);
CREATE INDEX office_item_item_idx ON inventory.office_item USING btree (office);


-- inventory.office_item foreign keys

ALTER TABLE inventory.office_item ADD CONSTRAINT office_item_office_fkey FOREIGN KEY (office) REFERENCES office(id);
ALTER TABLE inventory.office_item ADD CONSTRAINT office_item_item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);