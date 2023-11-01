ALTER TABLE hrm.allowance
ADD COLUMN company uuid not null;

ALTER TABLE hrm.allowance_package
ADD COLUMN company uuid not null;

