ALTER TABLE inventory.inventory_ledger ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.inventory_ledger DROP CONSTRAINT IF EXISTS inventory_ledger_company_fkey;
ALTER TABLE inventory.inventory_ledger
    ADD CONSTRAINT inventory_ledger_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS inventory_ledger_company_idx ON inventory.inventory_ledger (company);

