ALTER TABLE asset.assets  add column fixed_asset_item uuid;
ALTER TABLE asset.assets
    ADD CONSTRAINT fixed_asset_item_fkey FOREIGN KEY (fixed_asset_item) REFERENCES fixed_asset.fixed_asset_items (id);