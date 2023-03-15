ALTER TABLE billing.jobs DROP COLUMN order_type,
DROP COLUMN layout_cost,
DROP COLUMN shipping_cost,
DROP COLUMN total_cost;

ALTER TABLE billing.jobs ADD COLUMN repair uuid default null,
ADD COLUMN insurance uuid default null,
ADD COLUMN plate_no varchar(500) default null,
ADD COLUMN engine_no varchar(500) default null,
ADD COLUMN chassis_no varchar(500) default null,
ADD COLUMN body_no varchar(500) default null,
ADD COLUMN year_model varchar(500) default null,
ADD COLUMN series varchar(500) default null,
ADD COLUMN make varchar(500) default null;