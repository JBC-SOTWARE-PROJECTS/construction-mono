CREATE SCHEMA IF NOT EXISTS accounting;

CREATE TABLE accounting.fiscals (
    id uuid NOT NULL primary key,
    fiscal_id varchar NULL,
    from_date date NULL,
    to_date date NULL,
    remarks varchar NULL,
    active boolean NULL,
    lock_january boolean NULL,
    lock_february boolean NULL,
    lock_march boolean NULL,
    lock_april boolean NULL,
    lock_may boolean NULL,
    lock_june boolean NULL,
    lock_july boolean NULL,
    lock_august boolean NULL,
    lock_september boolean NULL,
    lock_october boolean NULL,
    lock_november boolean NULL,
    lock_december boolean NULL,
    created_by varchar NULL ,
    created_date timestamp  NULL DEFAULT current_timestamp,
    last_modified_by varchar COLLATE "default",
    last_modified_date timestamp NULL DEFAULT current_timestamp
);
