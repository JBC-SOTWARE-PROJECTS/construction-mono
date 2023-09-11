CREATE INDEX if not exists billing_item_billing_idx ON billing.billing_item  USING btree (billing);
CREATE INDEX if not exists billing_item_filter_item_type_idx ON billing.billing_item  USING btree (description, record_no, billing, item_type);





