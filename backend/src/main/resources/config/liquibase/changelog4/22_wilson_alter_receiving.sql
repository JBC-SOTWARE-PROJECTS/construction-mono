ALTER TABLE inventory.receiving_report ADD posted_ledger uuid NULL;
ALTER TABLE inventory.receiving_report ADD ref_ap uuid NULL;
ALTER TABLE inventory.receiving_report ADD consignment bool NULL DEFAULT false;
ALTER TABLE inventory.receiving_report ADD fix_asset bool NULL DEFAULT false;
ALTER TABLE inventory.receiving_report ADD company bool NULL DEFAULT false;