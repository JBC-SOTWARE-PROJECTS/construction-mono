
INSERT INTO t_permission (name, description)
  SELECT 'manage_asset_rent_config', 'Permission to Manage Rent Config'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'manage_asset_rent_config'
  );

  INSERT INTO t_permission (name, description)
    SELECT 'add_rent_details_to_vehicle_usage', 'Permission to Add Rent Details to Vehicle Usage'
    WHERE NOT EXISTS(
      SELECT 1 FROM public.t_permission WHERE name = 'add_rent_details_to_vehicle_usage'
    );


 INSERT INTO t_permission (name, description)
    SELECT 'manage_employee_on_vehicle_usage', 'Permission to Manage Employees on Vehicle Usage'
    WHERE NOT EXISTS(
      SELECT 1 FROM public.t_permission WHERE name = 'manage_employee_on_vehicle_usage'
    );










