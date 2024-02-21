-- asset.asset_maintenance_type definition

-- Drop table

-- DROP TABLE job.asset_maintenance_type;

CREATE TABLE hrm.employee_documents (
	id uuid NOT NULL,
	doc_type varchar,
	description varchar,
	file varchar,
	employee uuid,
	company uuid,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT emp_docs_pkey PRIMARY KEY (id)
);





ALTER TABLE hrm.employee_documents ADD CONSTRAINT employee_fkey FOREIGN KEY (employee) REFERENCES hrm.employees(id);
ALTER TABLE hrm.employee_documents ADD CONSTRAINT company_fkey FOREIGN KEY (company) REFERENCES public.company(id);



