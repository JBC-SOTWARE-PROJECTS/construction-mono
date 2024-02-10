INSERT INTO t_authority (name)
SELECT 'ROLE_ASSET_MANAGEMENT'
WHERE NOT EXISTS(
    SELECT 1 FROM public.t_authority WHERE name = 'ROLE_ASSET_MANAGEMENT'
  );


INSERT INTO t_authority (name)
SELECT 'ROLE_UPCOMING_PMS'
WHERE NOT EXISTS(
    SELECT 1 FROM public.t_authority WHERE name = 'ROLE_UPCOMING_PMS'
  );


INSERT INTO t_permission (name, description)
  SELECT 'manage_asset', 'Permission to Manage Asset'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'manage_asset'
  );

INSERT INTO t_permission (name, description)
  SELECT 'manage_asset', 'Permission to Manage Asset'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'manage_asset'
  );

INSERT INTO t_permission (name, description)
  SELECT 'manage_pms', 'Permission to Manage Preventive Maintenance'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'manage_pms'
  );

INSERT INTO t_permission (name, description)
  SELECT 'manage_repairs_and_maintenance', 'Permission to Manage Repairs and Maintenance'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'manage_repairs_and_maintenance'
  );

INSERT INTO t_permission (name, description)
  SELECT 'manage_vehicle_usage', 'Permission to Manage Vehicle Usage'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'manage_vehicle_usage'
  );









