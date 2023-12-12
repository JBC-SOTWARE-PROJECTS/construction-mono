ALTER TABLE inventory.item_groups ADD COLUMN company uuid default null;
ALTER TABLE inventory.item_groups
    ADD CONSTRAINT item_groups_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS item_groups_company_idx ON inventory.item_groups (company);

ALTER TABLE inventory.item_categories ADD COLUMN company uuid default null;
ALTER TABLE inventory.item_categories
    ADD CONSTRAINT item_categories_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS item_categories_company_idx ON inventory.item_categories (company);

ALTER TABLE inventory.unit_measurements ADD COLUMN company uuid default null;
ALTER TABLE inventory.unit_measurements
    ADD CONSTRAINT unit_measurements_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS unit_measurements_company_idx ON inventory.unit_measurements (company);

ALTER TABLE inventory.generics ADD COLUMN company uuid default null;
ALTER TABLE inventory.generics
    ADD CONSTRAINT generics_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS generics_company_idx ON inventory.generics (company);

ALTER TABLE inventory.supplier_types ADD COLUMN company uuid default null;
ALTER TABLE inventory.supplier_types
    ADD CONSTRAINT supplier_types_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS supplier_types_company_idx ON inventory.supplier_types (company);

ALTER TABLE inventory.payment_terms ADD COLUMN company uuid default null;
ALTER TABLE inventory.payment_terms
    ADD CONSTRAINT payment_terms_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS payment_terms_company_idx ON inventory.payment_terms (company);

ALTER TABLE billing.job_status ADD COLUMN company uuid default null;
ALTER TABLE billing.job_status
    ADD CONSTRAINT job_status_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS job_status_company_idx ON billing.job_status (company);



