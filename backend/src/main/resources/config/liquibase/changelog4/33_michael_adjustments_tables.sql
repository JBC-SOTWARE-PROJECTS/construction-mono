CREATE TABLE payroll.payroll_adjustment (
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

    CONSTRAINT fk_adjustment_payroll_id FOREIGN KEY (payroll) REFERENCES payroll.payrolls(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT payroll_adjustment_finalized_by_employees_id FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (payroll)
);

CREATE TABLE payroll.payroll_employee_adjustment (
    employee uuid NOT NULL,
    payroll_adjustment uuid,
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
    CONSTRAINT fk_adjustment_employees_payroll_employee_id FOREIGN KEY (employee) REFERENCES payroll.payroll_employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_adjustment_employees_adjustment_payroll FOREIGN KEY (payroll_adjustment) REFERENCES payroll.payroll_adjustment(payroll) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT adjustment_employee_finalized_by_employees_id FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (employee)
);

CREATE TABLE payroll.payroll_adjustment_item (
    id uuid NOT NULL,
    employee uuid NOT NULL,
    adjustment_category uuid NOT NULL,
    description varchar,
    amount numeric(15,2),

    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),

    company uuid NOT NULL,
    CONSTRAINT fk_adjustment_employee_id FOREIGN KEY (employee) REFERENCES payroll.payroll_employee_adjustment(employee) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE payroll.adjustment_category (
    id uuid NOT NULL,
    name varchar NOT NULL,
    description varchar,
    operation varchar,
    status bool,
    is_default bool,
    company uuid,
    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),
    deleted bool DEFAULT false

);