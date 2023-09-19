INSERT INTO t_authority (name)
SELECT 'PAYROLL_CONTRIBUTIONS_USER'
WHERE NOT EXISTS(
    SELECT 1 FROM public.t_authority WHERE name = 'PAYROLL_CONTRIBUTIONS_USER'
  );


INSERT INTO t_permission (name, description)
  SELECT 'enable_or_disable_payroll_contribution_types', 'Permission to Enable/Disable Payroll Contribution Types'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'enable_or_disable_payroll_contribution_types'
  );

INSERT INTO t_permission (name, description)
  SELECT 'enable_or_disable_employee_contribution', 'Permission to Enable/Disable Employee Contribution'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'enable_or_disable_employee_contribution'
  );

INSERT INTO t_permission (name, description)
  SELECT 'recalculate_one_contributions_employee', 'Permission to Recalculate Employee Contribution'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'recalculate_one_contributions_employee'
  );




