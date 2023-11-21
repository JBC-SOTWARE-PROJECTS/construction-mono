CREATE TABLE payroll.other_deduction_types (
    id uuid NOT NULL,
    name varchar,
    code varchar,
    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),
    deleted bool,
    company uuid NOT NULL,
    PRIMARY KEY (id)
);