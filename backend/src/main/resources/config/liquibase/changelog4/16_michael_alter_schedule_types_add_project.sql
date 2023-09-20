alter table hrm.schedule
add column project uuid,
add column is_multi_project bool
;

alter table hrm.employee_schedule
add column project uuid;


