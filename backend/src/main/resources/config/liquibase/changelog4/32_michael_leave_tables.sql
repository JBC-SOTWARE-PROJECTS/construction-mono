CREATE TABLE hrm.employee_leave (
    id uuid NOT NULL,
    employee uuid,
    reason varchar(255) NOT NULL,
    leave_type varchar(50) NOT NULL,
    dates jsonb,
    with_pay bool,
    status varchar,

    company uuid,

    deleted bool,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee FOREIGN KEY (employee) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (id)
);
