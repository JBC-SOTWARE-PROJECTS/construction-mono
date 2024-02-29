alter table asset.vehicle_usage_monitoring add column rental_rate numeric(15,2) NULL;
alter table asset.vehicle_usage_monitoring add column rental_basis UUID NULL;

ALTER TABLE asset.vehicle_usage_monitoring ADD CONSTRAINT rental_basis_fkey FOREIGN KEY (rental_basis) REFERENCES asset.rental_rates(id);
