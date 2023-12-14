alter table hrm.allowance
add column subaccount_code varchar;

alter table payroll.adjustment_category
add column subaccount_code varchar;


alter table payroll.other_deduction_types
add column subaccount_code varchar;