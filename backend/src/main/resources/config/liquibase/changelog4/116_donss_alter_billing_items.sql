ALTER TABLE billing.billing_item
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_billing_item_company_id ON billing.billing_item(company_id);
