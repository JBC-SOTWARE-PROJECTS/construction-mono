ALTER TABLE inventory.return_supplier ADD COLUMN posted_by varchar default null,
ADD COLUMN posted_ledger uuid default null,
ADD COLUMN trans_type uuid default null;

ALTER TABLE inventory.return_supplier ADD CONSTRAINT return_supplier_trans_type_fkey FOREIGN KEY (trans_type) REFERENCES inventory.transaction_type(id);

