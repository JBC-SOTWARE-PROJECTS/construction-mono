-- asset.rental_type definition

-- Drop table

-- DROP TABLE asset.rental_typ;

CREATE TABLE asset.rental_rates (
	id uuid NOT NULL,
	rent_type varchar,
	description varchar,
	measurement varchar,
	amount numeric(15,2) NULL,
	unit varchar,
	asset uuid,
	company uuid,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT asset_rental_pkey PRIMARY KEY (id)
);





ALTER TABLE asset.rental_rates ADD CONSTRAINT asset_fkey FOREIGN KEY (asset) REFERENCES asset.assets(id);
ALTER TABLE asset.rental_rates ADD CONSTRAINT company_fkey FOREIGN KEY (company) REFERENCES public.company(id);



