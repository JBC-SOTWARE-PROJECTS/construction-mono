CREATE TABLE payroll.payroll_allowances (
    payroll uuid NOT NULL,
    description varchar,
    status varchar(20) NOT NULL,
    finalized_by uuid,
    finalized_date timestamp,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT finalized_by_fk FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id),
    CONSTRAINT fk_payroll_allowances_payroll__id FOREIGN KEY (payroll) REFERENCES payroll.payrolls(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (payroll)
);

CREATE TABLE payroll.payroll_employee_allowances (
    employee uuid NOT NULL,
    status varchar(20) NOT NULL,
    payroll_allowance uuid NOT NULL,
    finalized_by uuid,
    finalized_date timestamp,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payroll_employee_allowances_payroll_allowances_payroll FOREIGN KEY (payroll_allowance) REFERENCES payroll.payroll_allowances(payroll) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_payroll_employee_allowances_payroll_employee_id FOREIGN KEY (employee) REFERENCES payroll.payroll_employees(id) ON DELETE CASCADE,
    CONSTRAINT payroll_employee_allowances_finalized_by_employees_id FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (employee)
);

CREATE TABLE payroll.payroll_allowance_items (
    id uuid NOT NULL,
    payroll_employee_allowance uuid NOT NULL,
    name varchar NOT NULL,
    amount numeric(15,2) NOT NULL,
    original_amount numeric(15,2) DEFAULT 0,
    deleted bool DEFAULT false,
    allowance uuid NOT NULL,
    CONSTRAINT fk_employee_allowance_employee_allowance_items_employee FOREIGN KEY (payroll_employee_allowance) REFERENCES payroll.payroll_employee_allowances(employee) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id)
);


--drop table payroll.payroll_allowance_items ;
--drop table payroll.payroll_employee_allowances;
--drop table  payroll.payroll_allowances;