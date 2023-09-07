ALTER TABLE billing.billing ADD COLUMN company uuid default null;
CREATE INDEX if not exists billing_company_idx ON billing.billing USING btree (company);