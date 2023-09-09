CREATE TABLE payroll.payrolls (
    id uuid NOT NULL,
    title varchar(50),
    description varchar,
    status varchar(20),
    start_date timestamp DEFAULT CURRENT_TIMESTAMP,
    end_date timestamp DEFAULT CURRENT_TIMESTAMP,
    finalized_by varchar(50),
    finalized_date timestamp DEFAULT CURRENT_TIMESTAMP,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted bool,
    PRIMARY KEY (id)
);

CREATE TABLE payroll.payroll_employees (
    id uuid NOT NULL,
    payroll uuid,
    employee uuid,
    status varchar,
    deleted bool,
    deleted_date timestamp DEFAULT CURRENT_TIMESTAMP,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee FOREIGN KEY (employee) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_payroll_employee FOREIGN KEY (payroll) REFERENCES payroll.payrolls(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (id)
);