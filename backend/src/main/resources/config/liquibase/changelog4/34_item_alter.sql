ALTER TABLE inventory.item add column fix_asset bool default false, add column company uuid default null;
ALTER TABLE inventory.item
    ADD CONSTRAINT item_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX idx_item_company ON inventory.item USING btree (company);
