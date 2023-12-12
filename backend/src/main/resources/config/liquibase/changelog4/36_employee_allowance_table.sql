CREATE TABLE hrm.employee_allowance (
    id uuid NOT NULL  ,
    employee uuid NOT NULL,
    allowance uuid not null,
    name varchar NOT NULL,
    amount numeric(15,2) NOT NULL,
    allowance_type varchar NOT NULL,
    notes varchar,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted bool,
    company uuid,
    CONSTRAINT fk_employee_allowance_employee_id FOREIGN KEY (employee) REFERENCES hrm.employees(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (id)
);

drop table hrm.allowance_item;

CREATE TABLE hrm.allowance_item (
    id uuid NOT NULL,
    allowance uuid NOT NULL,
    package uuid NOT NULL,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted bool,
    company uuid NOT NULL,
    name varchar,
    amount numeric,
    allowance_type varchar,
    CONSTRAINT fk_allowance_item_allowance FOREIGN KEY (allowance) REFERENCES hrm.allowance(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_allowance_item_package FOREIGN KEY (package) REFERENCES hrm.allowance_package(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (id)
);

alter table hrm.employees
add column allowance_package uuid;