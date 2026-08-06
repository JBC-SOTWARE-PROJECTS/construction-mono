ALTER TABLE cashier.payments
ADD COLUMN IF NOT EXISTS company_id uuid,
ADD COLUMN IF NOT EXISTS transaction_type varchar,
ADD COLUMN IF NOT EXISTS change numeric;

ALTER TABLE cashier.payment_items
ADD COLUMN IF NOT EXISTS company_id uuid,
ADD COLUMN IF NOT EXISTS deductions numeric,
ADD COLUMN IF NOT EXISTS recoupment numeric,
ADD COLUMN IF NOT EXISTS retention numeric;

ALTER TABLE billing.discount_details
ADD COLUMN IF NOT EXISTS item_type varchar;