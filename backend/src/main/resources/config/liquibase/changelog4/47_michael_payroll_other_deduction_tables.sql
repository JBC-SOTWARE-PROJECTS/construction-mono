CREATE TABLE payroll.payroll_other_deduction (
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

    CONSTRAINT fk_other_deduction_payroll_id FOREIGN KEY (payroll) REFERENCES payroll.payrolls(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT payroll_other_deduction_finalized_by_employees_id FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (payroll)
);

CREATE TABLE payroll.payroll_employee_other_deduction (
    employee uuid NOT NULL,
    payroll_other_deduction uuid,
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
    CONSTRAINT fk_other_deduction_employees_payroll_employee_id FOREIGN KEY (employee) REFERENCES payroll.payroll_employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_other_deduction_employees_other_deduction_payroll FOREIGN KEY (payroll_other_deduction) REFERENCES payroll.payroll_other_deduction(payroll) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT other_deduction_employee_finalized_by_employees_id FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (employee)
);

CREATE TABLE payroll.payroll_other_deduction_item (
    id uuid NOT NULL,
    employee uuid NOT NULL,
    other_deduction_type uuid NOT NULL,
    name varchar,
    description varchar,
    amount numeric(15,2),

    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),

    company uuid NOT NULL,
    CONSTRAINT fk_other_deduction_employee_id FOREIGN KEY (employee) REFERENCES payroll.payroll_employee_other_deduction(employee) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id)
);

