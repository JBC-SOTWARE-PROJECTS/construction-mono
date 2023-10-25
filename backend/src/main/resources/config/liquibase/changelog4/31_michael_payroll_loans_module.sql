CREATE TABLE payroll.payroll_loans (
    payroll uuid NOT NULL,

    status varchar,
    company uuid NOT NULL,

    finalized_by uuid,
    finalized_date timestamp,

    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted bool,
    deleted_date timestamp DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_loan_payroll_id FOREIGN KEY (payroll) REFERENCES payroll.payrolls(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT payroll_loan_finalized_by_employees_id FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (payroll)
);

CREATE TABLE payroll.payroll_employee_loans (
    employee uuid NOT NULL,
    payroll_loans uuid,
    status varchar,
    deleted bool,
    deleted_date timestamp DEFAULT CURRENT_TIMESTAMP,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    finalized_by uuid,
    finalized_date timestamp,
    company uuid NOT NULL,
    CONSTRAINT fk_loans_employees_payroll_employee_id FOREIGN KEY (employee) REFERENCES payroll.payroll_employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_loans_employees_loans_payroll FOREIGN KEY (payroll_loans) REFERENCES payroll.payroll_loans(payroll) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT loans_employee_finalized_by_employees_id FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (employee)
);

CREATE TABLE payroll.payroll_loan_items (
    id uuid NOT NULL,
    employee uuid NOT NULL,
    category varchar,
    description varchar,
    amount numeric(15,2),
    status bool,
    
    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),
    deleted bool DEFAULT false,

    company uuid NOT NULL,
    CONSTRAINT fk_loans_employee_id FOREIGN KEY (employee) REFERENCES payroll.payroll_employee_loans(employee) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id)
);