ALTER TABLE cashier.shifting ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE cashier.shifting DROP CONSTRAINT IF EXISTS shifting_company_fkey;
ALTER TABLE cashier.shifting
    ADD CONSTRAINT shifting_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS shifting_company_idx ON cashier.shifting (company);


ALTER TABLE cashier.terminals ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE cashier.terminals DROP CONSTRAINT IF EXISTS terminals_company_fkey;
ALTER TABLE cashier.terminals
    ADD CONSTRAINT terminals_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS terminals_company_idx ON cashier.terminals (company);