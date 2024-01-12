ALTER TABLE inventory.purchase_request ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.purchase_request DROP CONSTRAINT IF EXISTS purchase_requests_company_fkey;
ALTER TABLE inventory.purchase_request
    ADD CONSTRAINT purchase_requests_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS purchase_requests_company_idx ON inventory.purchase_request (company);


ALTER TABLE inventory.purchase_order ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.purchase_order DROP CONSTRAINT IF EXISTS purchase_order_company_fkey;
ALTER TABLE inventory.purchase_order
    ADD CONSTRAINT purchase_order_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS purchase_order_company_idx ON inventory.purchase_order (company);

ALTER TABLE inventory.receiving_report DROP COLUMN IF EXISTS company;
ALTER TABLE inventory.receiving_report ADD COLUMN IF NOT EXISTS company uuid default null;
ALTER TABLE inventory.receiving_report DROP CONSTRAINT IF EXISTS receiving_report_company_fkey;
ALTER TABLE inventory.receiving_report
    ADD CONSTRAINT receiving_report_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
CREATE INDEX IF NOT EXISTS receiving_report_company_idx ON inventory.receiving_report (company);