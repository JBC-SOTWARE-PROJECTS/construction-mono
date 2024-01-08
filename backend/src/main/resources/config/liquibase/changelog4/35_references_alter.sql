ALTER TABLE inventory.receiving_report ADD COLUMN reference_type varchar default null;
ALTER TABLE inventory.return_supplier ADD COLUMN reference_type varchar default null;
ALTER TABLE accounting.disbursement ADD COLUMN reference_type varchar default null, ADD COLUMN reference_no varchar default null;
ALTER TABLE accounting.reapplication ADD COLUMN reference_no varchar default null;
ALTER TABLE accounting.petty_cash ADD COLUMN reference_type varchar default null, ADD COLUMN reference_no varchar default null;
ALTER TABLE accounting.debit_memo ADD COLUMN reference_type varchar default null, ADD COLUMN reference_no varchar default null;