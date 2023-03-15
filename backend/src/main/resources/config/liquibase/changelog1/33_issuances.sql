-- inventory.stock_issue definition

-- Drop table

-- DROP TABLE inventory.stock_issue;

CREATE TABLE inventory.stock_issue (
	id uuid NOT NULL,
	issue_no varchar NULL,
	issue_date timestamp NULL,
	issue_type varchar NULL,
	issue_from uuid NULL,
	issue_to uuid NULL,
	issued_by uuid NULL,
	is_posted bool NULL,
	is_cancel bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT stock_issue_pkey PRIMARY KEY (id)
);


-- inventory.stock_issue_items definition

-- Drop table

-- DROP TABLE inventory.stock_issue_items;

CREATE TABLE inventory.stock_issue_items (
	id uuid NOT NULL,
	stock_issue uuid NULL,
	item uuid NULL,
	issue_qty int4 NULL,
	unit_cost numeric NULL,
	is_posted bool NULL,
	remarks varchar NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

	CONSTRAINT stock_issue_items_pkey PRIMARY KEY (id)
);


-- inventory.stock_issue foreign keys

ALTER TABLE inventory.stock_issue ADD CONSTRAINT stock_issue_issue_from_fkey FOREIGN KEY (issue_from) REFERENCES office(id);
ALTER TABLE inventory.stock_issue ADD CONSTRAINT stock_issue_issue_to_fkey FOREIGN KEY (issue_to) REFERENCES office(id);
ALTER TABLE inventory.stock_issue ADD CONSTRAINT stock_issue_issued_by_fkey FOREIGN KEY (issued_by) REFERENCES hrm.employees(id);


-- inventory.stock_issue_items foreign keys

ALTER TABLE inventory.stock_issue_items ADD CONSTRAINT stock_issue_items_item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);
ALTER TABLE inventory.stock_issue_items ADD CONSTRAINT stock_issue_items_stock_issue_fkey FOREIGN KEY (stock_issue) REFERENCES inventory.stock_issue(id);