ALTER TABLE inventory.quantity_adjustment_type ADD COLUMN company uuid default null, ADD COLUMN source_column varchar default null;
ALTER TABLE inventory.quantity_adjustment_type
    ADD CONSTRAINT quantity_adjustment_type_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS quantity_adjustment_type_company_idx ON inventory.quantity_adjustment_type (company);
DROP INDEX inventory.transaction_type_company_idx;
CREATE INDEX IF NOT EXISTS transaction_type_company_idx ON inventory.transaction_type (company);
