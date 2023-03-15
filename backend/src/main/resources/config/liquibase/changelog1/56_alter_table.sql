ALTER TABLE billing.billing_item ADD COLUMN service uuid default null;
ALTER TABLE billing.job_items ADD COLUMN service uuid default null;