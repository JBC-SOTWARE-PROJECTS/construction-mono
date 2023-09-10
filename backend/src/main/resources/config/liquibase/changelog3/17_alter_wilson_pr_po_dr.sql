ALTER TABLE inventory.purchase_request ADD column asset uuid default null, ADD column category varchar default null;
ALTER TABLE inventory.purchase_order ADD column asset uuid default null, ADD column category varchar default null;
ALTER TABLE inventory.receiving_report ADD column asset uuid default null, ADD column category varchar default null;