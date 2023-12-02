

CREATE TABLE asset.asset_repair_maintenance (
	id uuid NOT NULL,
	service_type varchar,
	service_classification varchar NULL,
	service_datetime_start timestamp NULL,
	service_datetime_finished timestamp NULL,
	work_description varchar NULL,
	findings varchar NULL,
	worked_by_employees varchar NULL,
	status varchar NULL,
	rm_image varchar NULL,
	inspection_remarks varchar NULL,
	project uuid,
	asset uuid,
	company uuid,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT asset_repair_maintenance_pkey PRIMARY KEY (id)
);





-- asset.asset_preventive_maintenance foreign keys

ALTER TABLE asset.asset_repair_maintenance ADD CONSTRAINT project_fkey FOREIGN KEY (project) REFERENCES projects.projects(id);
ALTER TABLE asset.asset_repair_maintenance ADD CONSTRAINT asset_fkey FOREIGN KEY (asset) REFERENCES asset.assets(id);
ALTER TABLE asset.asset_repair_maintenance ADD CONSTRAINT company_fkey FOREIGN KEY (company) REFERENCES public.company(id);



