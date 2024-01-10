CREATE TABLE payroll.withholding_tax_matrix (
    id uuid NOT NULL,
    min_amount numeric(15,2) NOT NULL,
    max_amount numeric(15,2) NOT NULL,
    base_amount numeric(15,2) NOT NULL,
    percentage numeric(15,2) NOT NULL,
    threshold_amount numeric(15,2) NOT NULL,
    type varchar not null,
    company uuid,

    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),
    deleted bool,

    PRIMARY KEY (id)
);
