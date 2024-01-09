

CREATE TABLE asset.vehicle_usage_monitoring (
	id uuid NOT NULL,
	usage_purpose varchar NULL,
	route varchar NULL,
	start_datetime timestamp NULL,
	end_datetime timestamp NULL,
	start_odometer_reading varchar NULL,
	end_odometer_reading varchar NULL,
	start_fuel_reading varchar NULL,
	end_fuel_reading varchar NULL,
	project uuid,
	asset uuid,
	item uuid,
	company uuid,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT asset_vehicle_usage_monitoring_pkey PRIMARY KEY (id)
);





-- asset.asset_preventive_maintenance foreign keys

ALTER TABLE asset.vehicle_usage_monitoring ADD CONSTRAINT project_fkey FOREIGN KEY (project) REFERENCES projects.projects(id);
ALTER TABLE asset.vehicle_usage_monitoring ADD CONSTRAINT item_fkey FOREIGN KEY (item) REFERENCES inventory.item(id);
ALTER TABLE asset.vehicle_usage_monitoring ADD CONSTRAINT asset_fkey FOREIGN KEY (asset) REFERENCES asset.assets(id);
ALTER TABLE asset.vehicle_usage_monitoring ADD CONSTRAINT company_fkey FOREIGN KEY (company) REFERENCES public.company(id);



