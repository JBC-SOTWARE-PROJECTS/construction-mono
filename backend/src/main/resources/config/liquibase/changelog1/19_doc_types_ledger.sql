-- inventory.document_types definition

-- Drop table

-- DROP TABLE inventory.document_types;

CREATE TABLE inventory.document_types (
	id uuid NOT NULL,
	document_code varchar NULL,
	document_desc varchar NULL,
	
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT document_types_pkey PRIMARY KEY (id)
);


-- inventory.inventory_ledger definition

-- Drop table

-- DROP TABLE inventory.inventory_ledger;

CREATE TABLE inventory.inventory_ledger (
	id uuid NOT NULL,
	source_office uuid NULL,
	destination_office uuid NULL,
	document_types uuid NULL,
	item uuid NULL,
	reference_no varchar NULL,
	ledger_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	ledger_qty_in int4 NULL,
	ledger_qty_out int4 NULL,
	ledger_physical int4 NULL,
	ledger_unit_cost numeric NULL,
	is_include bool NULL DEFAULT true,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,
	CONSTRAINT inventory_ledger_pkey PRIMARY KEY (id)
);
CREATE INDEX inventory_ledger_document_types_idx ON inventory.inventory_ledger USING btree (document_types);
CREATE INDEX inventory_ledger_item_idx ON inventory.inventory_ledger USING btree (item);
CREATE INDEX inventory_ledger_source_office_idx ON inventory.inventory_ledger USING btree (source_office);


-- inventory.inventory_ledger foreign keys

ALTER TABLE inventory.inventory_ledger ADD CONSTRAINT inventory_ledger_destination_office_fkey FOREIGN KEY (destination_office) REFERENCES office(id);
ALTER TABLE inventory.inventory_ledger ADD CONSTRAINT inventory_ledger_document_types_fkey FOREIGN KEY (document_types) REFERENCES inventory.document_types(id);
ALTER TABLE inventory.inventory_ledger ADD CONSTRAINT inventory_ledger_item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);
ALTER TABLE inventory.inventory_ledger ADD CONSTRAINT inventory_ledger_source_office_fkey FOREIGN KEY (source_office) REFERENCES office(id);


---insert doctypes here
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('254a07d3-e33a-491c-943e-b3fe6792c5fc', 'SRR', 'STOCK RECEIVING', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('85dbf47b-fd3d-419b-b2b0-1d5621ba7f38', 'MI', 'MATERIAL ISSUES', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('19c0c388-7e85-4abf-aa13-cdafecf8dc8c', 'CS', 'CHARGESLIP', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('d12f0de2-cb65-42ab-bcdb-881ebce57045', 'STO', 'STOCKTRANSFER OUT', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('7250e64a-de1b-4015-80fb-e15f9f6762ab', 'STI', 'STOCKTRANSFER IN', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('56461ef7-5162-46ac-8fbb-0ab2bdcc2746', 'RTS', 'RETURN TO SUPPLIER', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('c17eb9d9-c0bd-432b-987e-b3c89edecab8', 'CSI', 'CASH SALES INVOICE', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('0f3c2b76-445a-4f78-a256-21656bd62872', 'EX', 'EXPENSE', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('0caab388-e53b-4e94-b2ea-f8cc47df6431', 'BEG', 'BEGINING BALANCE', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('7b94c82f-081a-4578-82c2-f7343852fcf3', 'SRR (FG)', 'STOCK RECEIVING (FG)', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('af7dc429-8352-4f09-b58c-26a0a490881c', 'EP', 'EMERGENCY PURCHASE', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('4f88d8d7-ecce-4538-a97b-88884b1e106e', 'ADJ', 'QUANTITY ADJUSTMENT', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('37683c86-3038-4207-baf0-b51456fd7037', 'PHY', 'PHYSICAL COUNT', 'system', '2020-04-07 11:05:32.102', NULL, '2020-04-07 11:05:32.102', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('5776d7f2-6972-4980-a0ef-360642ee7572', 'RCS', 'REVERSE CHARGESLIP', 'system', '2020-04-07 11:05:32.269', NULL, '2020-04-07 11:05:32.269', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('27d236bb-c023-44dc-beac-18ddfe1daf79', 'MPO', 'MATERIAL PRODUCTION (OUTPUT)', 'system', '2020-04-07 11:05:32.768', NULL, '2020-04-07 11:05:32.768', NULL);
INSERT INTO inventory.document_types (id, document_code, document_desc, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('c71a1f34-4358-4d6d-b504-488f1fcd4c31', 'MPS', 'MATERIAL PRODUCTION (SOURCE)', 'system', '2020-04-07 11:05:32.768', NULL, '2020-04-07 11:05:32.768', NULL);