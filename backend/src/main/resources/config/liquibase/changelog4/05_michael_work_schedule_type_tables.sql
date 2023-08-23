CREATE TABLE hrm.schedule (
    id uuid NOT NULL,
    date_time_start timestamp,
    date_time_end timestamp,
    meal_break_start timestamp,
    meal_break_end timestamp,
    color varchar(255),
    deleted bool,
    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),
    title varchar(255),
    company uuid,
    label varchar(255)
);


CREATE TABLE hrm.schedule_locks (
    id uuid NOT NULL,
    date timestamp,
    is_locked bool,
    created_by varchar(50),
    created_date timestamp DEFAULT now(),
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT now(),
    deleted bool,
    company uuid,
    PRIMARY KEY (id)
);

