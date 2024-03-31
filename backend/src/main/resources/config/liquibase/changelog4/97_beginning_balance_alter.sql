ALTER TABLE inventory.beginning_balance ADD COLUMN posted_by varchar default null,
ADD COLUMN posted_ledger uuid default null;