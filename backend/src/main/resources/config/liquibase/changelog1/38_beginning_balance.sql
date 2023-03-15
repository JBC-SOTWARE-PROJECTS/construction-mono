
CREATE TABLE inventory.beginning_balance (
	id uuid NOT NULL,
	ref_num varchar NULL,
	date_trans timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	item uuid NULL,
	office uuid NULL,
	quantity int4 NULL,
	unit_cost numeric NULL DEFAULT 0,
	is_posted bool NULL,
	is_cancel bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT beginning_balance_pkey PRIMARY KEY (id)
);


-- inventory.beginning_balance foreign keys

ALTER TABLE inventory.beginning_balance ADD CONSTRAINT beginning_balance_office_fkey FOREIGN KEY (office) REFERENCES office(id);
ALTER TABLE inventory.beginning_balance ADD CONSTRAINT beginning_balance_item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);