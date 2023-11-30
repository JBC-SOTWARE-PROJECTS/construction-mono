alter table payroll.payrolls
add column posted_ledger uuid,
add column posted bool,
add column posted_by varchar;
