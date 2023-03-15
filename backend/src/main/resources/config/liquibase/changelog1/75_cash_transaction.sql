ALTER TABLE cashier.petty_cash ADD COLUMN cash_type varchar DEFAULT null,
ADD COLUMN notes varchar(1000) default null,
ADD COLUMN received_from varchar default null;