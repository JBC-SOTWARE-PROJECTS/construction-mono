INSERT INTO t_permission (name, description)
  SELECT 'create_equipment_loan_beginning_balance', 'Permission to Create Equipment Loan Beginning Balances'
  WHERE NOT EXISTS(
    SELECT 1 FROM public.t_permission WHERE name = 'create_equipment_loan_beginning_balance'
  );
