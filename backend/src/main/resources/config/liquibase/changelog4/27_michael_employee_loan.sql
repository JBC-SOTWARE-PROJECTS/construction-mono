Create table payroll.employee_loan (
    id                  uuid NOT NULL primary key,
    employee			uuid not null,
    receiving_report    uuid,

	description         varchar,
	category            varchar,
    status              bool,
    amount				numeric,
    is_voided			bool,
    company             uuid not null,

	created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted             bool NULL
);