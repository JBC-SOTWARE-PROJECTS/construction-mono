ALTER TABLE asset.assets add column type varchar null, add column item uuid;
ALTER TABLE asset.assets
    ADD CONSTRAINT item_fkey FOREIGN KEY (item) REFERENCES inventory.item (id);