alter table hrm.schedule
add column project uuid not null;

alter table hrm.employee_schedule
add column project uuid;


