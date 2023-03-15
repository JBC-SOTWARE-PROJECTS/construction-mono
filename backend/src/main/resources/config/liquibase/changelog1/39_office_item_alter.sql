ALTER TABLE inventory.office_item ADD COLUMN actual_cost numeric default 0,
ADD COLUMN output_tax numeric default 0,
ADD COLUMN selling_price numeric default 0;