INSERT INTO t_authority (name)
SELECT 'PAYROLL_MANAGER'
WHERE NOT EXISTS(
    SELECT 1 FROM public.t_authority WHERE name = 'PAYROLL_MANAGER'
  );


INSERT INTO t_permission (name, description)
  SELECT 'edit_payroll', 'Permission to Edit Payroll Details'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'permission_to_edit_allowance'
  );

INSERT INTO t_permission (name, description)
  SELECT 'view_payroll', 'Permission to View Payroll'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'permission_to_edit_allowance'
  );

INSERT INTO t_permission (name, description)
  SELECT 'delete_payroll', 'Permission to Delete Payroll'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'permission_to_edit_allowance'
  );

INSERT INTO t_permission (name, description)
  SELECT 'create_new_payroll', 'Permission to Create New Payroll'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'permission_to_edit_allowance'
  );
