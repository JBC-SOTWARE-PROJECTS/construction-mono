ALTER TABLE accounting.disbursement_exp ADD COLUMN assets uuid default null;
ALTER TABLE accounting.disbursement_exp ADD CONSTRAINT disbursement_exp_assets_fkey FOREIGN KEY (assets) REFERENCES asset.assets(id);