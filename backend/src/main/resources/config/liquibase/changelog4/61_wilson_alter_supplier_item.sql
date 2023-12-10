ALTER TABLE inventory.supplier_item ADD COLUMN IF NOT EXISTS cost_unit_of_purchase numeric default 0;
