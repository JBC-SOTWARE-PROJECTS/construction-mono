ALTER TABLE accounting.payables_detials ADD COLUMN assets uuid default null;
ALTER TABLE accounting.payables_detials ADD CONSTRAINT payables_detials_assets_fkey FOREIGN KEY (assets) REFERENCES asset.assets(id);