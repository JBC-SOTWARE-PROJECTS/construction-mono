CREATE TABLE hrm.allowance_package (
    id                  uuid NOT NULL,
	name                varchar,
    status              bool,

	created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted             bool NULL
);