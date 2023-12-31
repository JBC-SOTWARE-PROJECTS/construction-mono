 drop view payroll.payroll_contributions_view;
 
 create view payroll.payroll_contributions_view
as
 SELECT e.id,
    e.basic_salary,
    s.ee_contribution AS ss_ee_amount,
    s.er_contribution AS ss_er_amount,
    s.er_ec_contribution AS ss_er_ec_amount,
    s.wisp_er_contribution AS sss_wisp_er,
    s.wisp_ee_contribution AS sss_wisp_ee,
    (s.er_contribution + s.er_ec_contribution +  s.wisp_er_contribution) AS ss_er_total,
    (s.ee_contribution + s.wisp_er_contribution) AS ss_ee_total,
    (((e.basic_salary * (p.rate / (100)::numeric)) / (2)::numeric))::numeric(15,2) AS phic_ee_amount,
    (((e.basic_salary * (p.rate / (100)::numeric)) / (2)::numeric))::numeric(15,2) AS phic_er_amount,
    ((e.basic_salary * (h.ee_rate / (100)::numeric)))::numeric(15,2) AS hdmf_ee_amount,
    ((e.basic_salary * (h.er_rate / (100)::numeric)))::numeric(15,2) AS hdmf_er_amount
   FROM (((hrm.employees e
     LEFT JOIN payroll.sss_contribution s ON (((e.basic_salary >= s.min_amount) AND ((e.basic_salary <= s.max_amount) OR (s.max_amount IS NULL)) AND ((s.max_amount IS NULL) OR (e.basic_salary <= s.max_amount)))))
     LEFT JOIN payroll.phic_contribution p ON (((e.basic_salary >= p.min_amount) AND ((e.basic_salary <= p.max_amount) OR (p.max_amount IS NULL)) AND ((p.max_amount IS NULL) OR (e.basic_salary <= p.max_amount)))))
     LEFT JOIN payroll.hdmf_contribution h ON (((e.basic_salary >= h.min_amount) AND ((e.basic_salary <= h.max_amount) OR (h.max_amount IS NULL)) AND ((h.max_amount IS NULL) OR (e.basic_salary <= h.max_amount)))))
  WHERE (e.is_active IS TRUE);

