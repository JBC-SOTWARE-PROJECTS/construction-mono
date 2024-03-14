
INSERT INTO t_permission (name, description)
  SELECT 'view_vehicle_usage', 'Permission to View Only Vehicle Usage Monitoring'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'view_vehicle_usage'
  );

  INSERT INTO t_permission (name, description)
    SELECT 'update_vehicle_usage', 'Permission to Update Only Vehicle Usage Monitoring'
    WHERE NOT EXISTS(
      SELECT 1 FROM public.t_permission WHERE name = 'update_vehicle_usage'
    );









