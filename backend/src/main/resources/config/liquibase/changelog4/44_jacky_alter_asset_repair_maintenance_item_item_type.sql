ALTER TABLE asset.asset_repair_maintenance_items  add column item_type varchar null;
ALTER TABLE asset.asset_repair_maintenance_items  add column supplier uuid;
ALTER TABLE asset.asset_repair_maintenance_items
    ADD CONSTRAINT supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier (id);