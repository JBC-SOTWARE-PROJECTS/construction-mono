INSERT INTO t_authority (name)
SELECT 'PAYROLL_MANAGER'
WHERE NOT EXISTS(
    SELECT 1 FROM public.t_authority WHERE name = 'PAYROLL_MANAGER'
  );


INSERT INTO t_permission (name, description)
  SELECT 'edit_payroll', 'Permission to Edit Payroll Details'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'edit_payroll'
  );

INSERT INTO t_permission (name, description)
  SELECT 'view_payroll', 'Permission to View Payroll'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'view_payroll'
  );

INSERT INTO t_permission (name, description)
  SELECT 'delete_payroll', 'Permission to Delete Payroll'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'delete_payroll'
  );

INSERT INTO t_permission (name, description)
  SELECT 'create_new_payroll', 'Permission to Create New Payroll'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'create_new_payroll'
  );

INSERT INTO t_permission (name, description)
  SELECT 'start_payroll', 'Permission to Start payroll'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'start_payroll'
  );


