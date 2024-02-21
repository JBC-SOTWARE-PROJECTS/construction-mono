

CREATE TABLE asset.vehicle_usage_employee (
	id uuid NOT NULL,
	designation varchar NULL,
	remarks varchar NULL,
	time_rendered_end timestamp NULL,
	time_rendered_start timestamp NULL,
	employee uuid,
	asset uuid,
	item uuid,
	vehicle_usage uuid,

    company uuid,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT asset_vehicle_usage_employee_pkey PRIMARY KEY (id)
);





-- asset.asset_preventive_maintenance foreign keys

ALTER TABLE asset.vehicle_usage_employee ADD CONSTRAINT employee_fkey FOREIGN KEY (employee) REFERENCES hrm.employees(id);
ALTER TABLE asset.vehicle_usage_employee ADD CONSTRAINT asset_fkey FOREIGN KEY (asset) REFERENCES asset.assets(id);
ALTER TABLE asset.vehicle_usage_employee ADD CONSTRAINT item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);
ALTER TABLE asset.vehicle_usage_employee ADD CONSTRAINT vehicle_usage_fkey FOREIGN KEY (vehicle_usage) REFERENCES asset.vehicle_usage_monitoring(id);



