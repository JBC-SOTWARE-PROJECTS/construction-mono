ALTER TABLE accounting.ledger
ADD COLUMN IF NOT EXISTS approved_by varchar NULL,
ADD COLUMN IF NOT EXISTS approved_datetime timestamp NULL;