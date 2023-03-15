CREATE TABLE billing.jobs (
	id uuid NOT NULL,
	date_trans timestamp NULL DEFAULT now(),
	deadline timestamp NULL DEFAULT now(),
	job_no varchar NULL,
	customer uuid NULL,
	order_type varchar null,

	layout_cost numeric,
	shipping_cost numeric,
	total_cost numeric,

	remarks varchar NULL,
	status varchar NULL,

	pending bool default false,
	completed bool default false,
	billed bool NULL DEFAULT false,

	deleted bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),

	CONSTRAINT jobs_pkey PRIMARY KEY (id)
);


-- job.jobs foreign keys

ALTER TABLE billing.jobs ADD CONSTRAINT jobs_customer_fkey FOREIGN KEY (customer) REFERENCES billing.customer(id);

-- job.job_items definition

-- Drop table

-- DROP TABLE job.job_items;

CREATE TABLE billing.job_items (
	id uuid NOT NULL,
	job uuid NULL,
	"type" varchar NULL,
	item uuid NULL,
	descriptions varchar NULL,
	qty int4 NULL,
	"cost" numeric NULL,
	total_cost numeric NULL,
	output_tax numeric NULL,
	billed bool NULL,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT job_items_pkey PRIMARY KEY (id)
);


-- job.job_items foreign keys

ALTER TABLE billing.job_items ADD CONSTRAINT job_items_job_fkey FOREIGN KEY (job) REFERENCES billing.jobs(id);