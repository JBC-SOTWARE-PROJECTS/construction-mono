ALTER TABLE payroll.payroll_contributions
ADD COLUMN is_active_sss bool default true,
ADD COLUMN is_active_hdmf bool default true,
ADD COLUMN is_active_phic bool default true;

ALTER TABLE hrm.employees
ADD COLUMN is_active_sss bool default true,
ADD COLUMN is_active_hdmf bool default true,
ADD COLUMN is_active_phic bool default true;