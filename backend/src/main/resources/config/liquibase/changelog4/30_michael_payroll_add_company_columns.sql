ALTER TABLE payroll.timekeepings
add column company uuid not null;

ALTER TABLE payroll.payroll_contributions
add column company uuid not null;

ALTER TABLE payroll.timekeeping_employees
add column company uuid not null;

ALTER TABLE payroll.accumulated_logs
add column company uuid not null;


ALTER TABLE payroll.payroll_employee_contributions
add column company uuid not null;
