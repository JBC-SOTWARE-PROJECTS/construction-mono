ALTER TABLE inventory.purchase_request ADD COLUMN project uuid default null;
ALTER TABLE inventory.receiving_report ADD COLUMN project uuid default null;