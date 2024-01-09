ALTER TABLE billing.billing_item
ADD COLUMN IF NOT EXISTS recalculation_date timestamp(6) DEFAULT null,
ADD COLUMN IF NOT EXISTS tag_no varchar DEFAULT null,
ADD COLUMN IF NOT EXISTS posted_ledger uuid DEFAULT null;