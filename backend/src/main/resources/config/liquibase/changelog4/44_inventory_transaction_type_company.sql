ALTER TABLE inventory.transaction_type ADD COLUMN company uuid default null, ADD COLUMN fix_asset bool default false, ADD COLUMN consignment bool default false;
ALTER TABLE inventory.transaction_type
    ADD CONSTRAINT transaction_type_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS transaction_type_company_idx ON inventory.item_groups (company);
