ALTER TABLE inventory.item ADD COLUMN fixed_asset_sub_account uuid default null,
ADD COLUMN fixed_asset_expense_sub_account uuid default null,
ADD COLUMN revenue_sub_account uuid default null,
ADD COLUMN for_sale bool default false;

ALTER TABLE inventory.item ADD CONSTRAINT item_fixed_asset_sub_account_fkey FOREIGN KEY (fixed_asset_sub_account) REFERENCES inventory.item_sub_account(id);
ALTER TABLE inventory.item ADD CONSTRAINT item_fixed_asset_expense_sub_account_fkey FOREIGN KEY (fixed_asset_expense_sub_account) REFERENCES inventory.item_sub_account(id);
ALTER TABLE inventory.item ADD CONSTRAINT item_revenue_sub_account_fkey FOREIGN KEY (revenue_sub_account) REFERENCES inventory.item_sub_account(id);
