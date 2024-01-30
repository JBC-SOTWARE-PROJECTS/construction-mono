ALTER TABLE inventory.stock_issue ADD COLUMN IF NOT EXISTS received_by uuid default null;
ALTER TABLE inventory.stock_issue DROP CONSTRAINT IF EXISTS stock_issue_company_fkey;
ALTER TABLE inventory.stock_issue
    ADD CONSTRAINT stock_issue_company_fkey FOREIGN KEY (received_by) REFERENCES hrm.employees (id);