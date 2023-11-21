ALTER TABLE hrm.employees
ADD COLUMN monthly_rate_amount numeric default 0,
ADD COLUMN hourly_rate_amount numeric default 0,
ADD COLUMN is_fixed_rate boolean default false,
ADD COLUMN is_excluded_from_attendance boolean default false;

ALTER TABLE payroll.timekeeping_employees
add column salary_breakdown jsonb;

ALTER TABLE payroll.timekeepings
add column salary_breakdown jsonb;