alter table hrm.salary_rate_multiplier
add column company uuid;

alter table payroll.sss_contribution
add column  company  uuid;

alter table payroll.hdmf_contribution
add column company uuid;

alter table payroll.phic_contribution
add column company uuid;





