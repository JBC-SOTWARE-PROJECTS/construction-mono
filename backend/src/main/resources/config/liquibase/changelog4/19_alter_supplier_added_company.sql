ALTER TABLE inventory.supplier ADD COLUMN company uuid default null;
CREATE INDEX idx_supplier_company ON inventory.supplier USING btree (company);