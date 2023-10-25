Create table payroll.employee_loan_ledger_item (
    id                  uuid NOT NULL primary key,
    employee			uuid not null,
    employee_loan		uuid,
    description         varchar,

    category            varchar,
    status              bool,
    debit				numeric,
    credit				numeric,
    company             uuid not null,

	created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted             bool NULL
);

alter table hrm.employees
add column employee_loan_config jsonb;