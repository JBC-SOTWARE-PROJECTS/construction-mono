-- inventory.item definition

-- Drop table

-- DROP TABLE inventory.item;

CREATE TABLE inventory.item (
	id uuid NOT NULL,
	sku varchar NULL,
	item_code varchar NULL,
	item_group uuid NULL,
	item_category uuid NULL,
	desc_long varchar NULL,
	brand varchar NULL,
    unit_of_purchase uuid NULL,
	unit_of_usage uuid NULL,
	item_generics uuid NULL,
    item_conversion numeric NULL,
    item_maximum numeric NULL,
    item_demand_qty numeric NULL,
	base_price numeric NULL,
	item_markup numeric NULL DEFAULT 0,
    markup_lock bool NULL DEFAULT false,
	is_medicine bool NULL DEFAULT false,
	vatable bool NULL,
	consignment bool NULL,
	discountable bool NULL,
	production bool NULL,
	active bool NULL DEFAULT true,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT items_pkey PRIMARY KEY (id)
);
CREATE INDEX item_active_idx ON inventory.item USING btree (active);
CREATE INDEX item_desc_long_idx ON inventory.item USING btree (desc_long);
CREATE INDEX item_is_medicine_idx ON inventory.item USING btree (is_medicine);
CREATE INDEX item_item_code_idx ON inventory.item USING btree (item_code);
CREATE INDEX item_sku_idx ON inventory.item USING btree (sku);


-- inventory.item foreign keys

ALTER TABLE inventory.item ADD CONSTRAINT fk_item_category FOREIGN KEY (item_category) REFERENCES inventory.item_categories(id);
ALTER TABLE inventory.item ADD CONSTRAINT fk_item_generics FOREIGN KEY (item_generics) REFERENCES inventory.generics(id);
ALTER TABLE inventory.item ADD CONSTRAINT fk_item_group FOREIGN KEY (item_group) REFERENCES inventory.item_groups(id);
ALTER TABLE inventory.item ADD CONSTRAINT fk_unit_of_purchase FOREIGN KEY (unit_of_purchase) REFERENCES inventory.unit_measurements(id);
ALTER TABLE inventory.item ADD CONSTRAINT fk_unit_of_usage FOREIGN KEY (unit_of_usage) REFERENCES inventory.unit_measurements(id);