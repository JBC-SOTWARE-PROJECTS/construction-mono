CREATE TABLE payroll.timekeepings (
    deleted bool,
    deleted_date timestamp DEFAULT CURRENT_TIMESTAMP,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    payroll uuid NOT NULL,
    finalized_by uuid,
    finalized_date timestamp,
    CONSTRAINT fk_timekeepings_payroll_id FOREIGN KEY (payroll) REFERENCES payroll.payrolls(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT payroll_timekeepings_finalized_by_employees_id FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (payroll)
);


CREATE TABLE payroll.timekeeping_employees (
    timekeeping uuid,
    employee uuid NOT NULL,
    status varchar,
    deleted bool,
    deleted_date timestamp DEFAULT CURRENT_TIMESTAMP,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    finalized_by uuid,
    finalized_date timestamp,
    CONSTRAINT fk_timekeeping_employees_payroll_employee_id FOREIGN KEY (employee) REFERENCES payroll.payroll_employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_timekeeping_employees_timekeepings_payroll FOREIGN KEY (timekeeping) REFERENCES payroll.timekeepings(payroll) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT timekeeping_employee_finalized_by_employees_id FOREIGN KEY (finalized_by) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (employee)
);

CREATE TABLE payroll.accumulated_logs (
    id uuid NOT NULL,
    timekeeping_employee uuid not null,
    log_date timestamp DEFAULT now(),
    schedule_start timestamp,
    schedule_end timestamp ,
    schedule_title varchar,
    in_time timestamp ,
    out_time timestamp ,
    message varchar,
    is_error bool,
    is_rest_day bool,
    is_leave bool,
    hours_log jsonb,
    project_breakdown jsonb,
    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),
    CONSTRAINT timekeeping_employee_fk FOREIGN KEY (timekeeping_employee) REFERENCES payroll.timekeeping_employees(employee) ON DELETE CASCADE,
    PRIMARY KEY (id)
);