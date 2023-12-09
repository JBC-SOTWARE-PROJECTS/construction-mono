ALTER TABLE inventory.signature_table ADD COLUMN company uuid default null, ADD COLUMN source_column varchar default null;
ALTER TABLE inventory.signature_table
    ADD CONSTRAINT signature_table_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS signature_table_company_idx ON inventory.signature_table (company);
