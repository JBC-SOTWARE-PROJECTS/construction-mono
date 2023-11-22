ALTER TABLE  accounting.ar_customers
ADD COLUMN IF NOT EXISTS contact_person varchar,
ADD COLUMN IF NOT EXISTS contact_no varchar,
ADD COLUMN IF NOT EXISTS contact_email varchar;
