ALTER TABLE inventory.item_sub_account ADD CONSTRAINT item_sub_account_pk PRIMARY KEY (id);
ALTER TABLE inventory.item add column specification varchar default null,
    add column asset_sub_account uuid default null,
    add column expense_sub_account uuid default null;

ALTER TABLE inventory.item
    ADD CONSTRAINT item_asset_sub_account_fkey FOREIGN KEY (asset_sub_account) REFERENCES inventory.item_sub_account (id);
ALTER TABLE inventory.item
    ADD CONSTRAINT item_expense_sub_account_fkey FOREIGN KEY (expense_sub_account) REFERENCES inventory.item_sub_account (id);

