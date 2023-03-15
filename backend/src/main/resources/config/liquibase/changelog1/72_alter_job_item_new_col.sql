ALTER TABLE billing.job_items ADD COLUMN wcost numeric default 0;

ALTER TABLE billing.billing_item ADD COLUMN wcost numeric default 0;
ALTER TABLE billing.billing_item ADD COLUMN output_tax numeric default 0;