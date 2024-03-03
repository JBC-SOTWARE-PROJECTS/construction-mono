alter table asset.vehicle_usage_monitoring add column rent_unit_measure_quantity numeric(15,2) NULL;
alter table asset.vehicle_usage_monitoring add column calculated_rental_fee numeric(15,2) NULL;
alter table asset.vehicle_usage_monitoring add column remarks varchar NULL;