alter table payroll.payroll_employees
add column withholding_tax numeric;

alter table payroll.payrolls
add column type VARCHAR;

