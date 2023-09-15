ALTER TABLE accounting.subaccount
ADD COLUMN IF NOT EXISTS company_id UUID,
ADD COLUMN IF NOT EXISTS is_inactive bool;
