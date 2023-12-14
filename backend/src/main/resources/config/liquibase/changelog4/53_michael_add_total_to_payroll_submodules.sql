alter table payroll.payroll_allowances
add column totals_breakdown jsonb,
add column total numeric;

alter table payroll.payroll_adjustment 
add column totals_breakdown jsonb;

alter table payroll.payroll_other_deduction
add column totals_breakdown jsonb;

alter table payroll.payroll_contributions
add column totals_breakdown jsonb;

alter table payroll.payroll_loans
add column totals_breakdown jsonb;

alter table payroll.employee_loan
add column posted_ledger uuid,
add column posted bool,
add column posted_by varchar;
