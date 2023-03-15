ALTER TABLE billing.jobs ADD COLUMN odometer_reading varchar default null,
ADD COLUMN customer_complain varchar default null,
ADD COLUMN repair_history varchar default null,
ADD COLUMN endorsement json default null,
ADD COLUMN date_realesed timestamp null;



