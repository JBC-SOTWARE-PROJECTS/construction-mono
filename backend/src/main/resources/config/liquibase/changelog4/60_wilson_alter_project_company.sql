ALTER TABLE projects.projects ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE projects.projects DROP CONSTRAINT IF EXISTS projects_company_fkey;
ALTER TABLE projects.projects
    ADD CONSTRAINT projects_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS projects_company_idx ON projects.projects (company);

ALTER TABLE inventory.office_item ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.office_item DROP CONSTRAINT IF EXISTS office_item_company_fkey;
ALTER TABLE inventory.office_item
    ADD CONSTRAINT office_item_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS office_item_company_idx ON inventory.office_item (company);

ALTER TABLE inventory.supplier_item ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.supplier_item DROP CONSTRAINT IF EXISTS supplier_item_company_fkey;
ALTER TABLE inventory.supplier_item
    ADD CONSTRAINT supplier_item_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS supplier_item_company_idx ON inventory.supplier_item (company);
