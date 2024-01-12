ALTER TABLE inventory.return_supplier ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.return_supplier DROP CONSTRAINT IF EXISTS return_supplier_company_fkey;
ALTER TABLE inventory.return_supplier
    ADD CONSTRAINT return_supplier_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS return_supplier_company_idx ON inventory.return_supplier (company);


ALTER TABLE inventory.stock_issue ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.stock_issue DROP CONSTRAINT IF EXISTS stock_issue_company_fkey;
ALTER TABLE inventory.stock_issue
    ADD CONSTRAINT stock_issue_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS stock_issue_company_idx ON inventory.stock_issue (company);

ALTER TABLE inventory.material_production ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.material_production DROP CONSTRAINT IF EXISTS material_production_company_fkey;
ALTER TABLE inventory.material_production
    ADD CONSTRAINT material_production_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS material_production_company_idx ON inventory.material_production (company);

ALTER TABLE inventory.quantity_adjustment ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.quantity_adjustment DROP CONSTRAINT IF EXISTS quantity_adjustment_company_fkey;
ALTER TABLE inventory.quantity_adjustment
    ADD CONSTRAINT quantity_adjustment_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS quantity_adjustment_company_idx ON inventory.quantity_adjustment (company);

ALTER TABLE inventory.beginning_balance ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.beginning_balance DROP CONSTRAINT IF EXISTS beginning_balance_company_fkey;
ALTER TABLE inventory.beginning_balance
    ADD CONSTRAINT beginning_balance_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS beginning_balance_company_idx ON inventory.beginning_balance (company);

