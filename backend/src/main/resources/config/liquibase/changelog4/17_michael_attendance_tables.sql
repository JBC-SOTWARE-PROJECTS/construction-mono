CREATE TABLE hrm.employee_attendance (
    id uuid NOT NULL,
    employee uuid,
    project uuid,
    attendance_time timestamp,
    type varchar,
    is_transfer bool,
    is_manual bool,
    original_type varchar,
    original_attendance_time timestamp,
    is_ignored bool,
    additional_note varchar,

    deleted bool,
    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),
    PRIMARY KEY (id)
);