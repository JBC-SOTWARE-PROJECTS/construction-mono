INSERT INTO t_authority (name)
SELECT 'MANAGE_SCHEDULE_TYPES'
WHERE NOT EXISTS(
    SELECT 1 FROM public.t_authority WHERE name = 'MANAGE_SCHEDULE_TYPES'
  );


INSERT INTO t_permission (name, description)
  SELECT 'add_edit_schedule_type', 'Permission to Add or Edit Schedule Types'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'permission_to_edit_allowance'
  );

INSERT INTO t_permission (name, description)
  SELECT 'delete_schedule_type', 'Permission to Delete Schedule Types'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'permission_to_edit_allowance'
  );

