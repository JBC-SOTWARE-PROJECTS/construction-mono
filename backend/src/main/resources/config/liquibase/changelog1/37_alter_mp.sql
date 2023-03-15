ALTER TABLE inventory.material_production ALTER COLUMN date_trans TYPE timestamp(0) USING date_trans::timestamp;
