ALTER TABLE accounting.fiscals
ADD COLUMN company_id uuid;

ALTER TABLE accounting.parent_account
ADD COLUMN company_id uuid;
