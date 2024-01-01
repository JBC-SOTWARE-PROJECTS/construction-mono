alter table payroll.payroll_adjustment_item
add column subaccount_code varchar;

alter table payroll.payroll_other_deduction_item
add column subaccount_code varchar;

alter table hrm.allowance
add column is_attendance_based bool;
