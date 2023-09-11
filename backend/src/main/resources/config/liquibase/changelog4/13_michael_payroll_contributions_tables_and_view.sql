ALTER TABLE hrm.employees
drop column monthly_basic_salary;

ALTER TABLE hrm.employees
add column basic_salary numeric;

CREATE TABLE "payroll"."payroll_contributions" (
    "payroll" uuid NOT NULL,
    "status" varchar(20) NOT NULL,
    "finalized_by" uuid,
    "finalized_date" timestamp,
    "created_by" varchar(50),
    "created_date" timestamp DEFAULT now(),
    "last_modified_by" varchar(50),
    "last_modified_date" timestamp DEFAULT now(),
    "deleted" bool,
    CONSTRAINT "finalized_by_fk" FOREIGN KEY ("finalized_by") REFERENCES "hrm"."employees"("id"),
    CONSTRAINT "fk_payroll_contributions_payroll__id" FOREIGN KEY ("payroll") REFERENCES "payroll"."payrolls"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("payroll")
);

CREATE TABLE "payroll"."payroll_employee_contributions" (
    "employee" uuid NOT NULL,
    "status" varchar(20) NOT NULL,
    "payroll_contribution" uuid NOT NULL,
    "sss_ee" numeric(15,2) DEFAULT 0,
    "sss_er" numeric(15,2) DEFAULT 0,
    "phic_ee" numeric(15,2) DEFAULT 0,
    "phic_er" numeric(15,2) DEFAULT 0,
    "hdmf_er" numeric(15,2) DEFAULT 0,
    "hdmf_ee" numeric(15,2) DEFAULT 0,
    "approved_by" uuid,
    "approved_date" timestamp,
    "finalized_by" uuid,
    "finalized_date" timestamp,
    "rejected_by" uuid,
    "rejected_date" timestamp,
    "created_by" varchar(50),
    "created_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "last_modified_by" varchar(50),
    "last_modified_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "basic_salary" numeric,
    "is_active_phic" bool DEFAULT true,
    "is_active_sss" bool DEFAULT true,
    "is_active_hdmf" bool DEFAULT true,
    "total" numeric(15,2) NOT NULL,
    "sss_wisp_er" numeric,
    "sss_wisp_ee" numeric,
    CONSTRAINT "approved_by_fk" FOREIGN KEY ("approved_by") REFERENCES "hrm"."employees"("id"),
    CONSTRAINT "fk_payroll_employee_contributions_payroll_contributions_payroll" FOREIGN KEY ("payroll_contribution") REFERENCES "payroll"."payroll_contributions"("payroll") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_payroll_employee_contributions_payroll_employee_id" FOREIGN KEY ("employee") REFERENCES "payroll"."payroll_employees"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "payroll_employee_contributions_finalized_by_employees_id" FOREIGN KEY ("finalized_by") REFERENCES "hrm"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payroll_employee_contributions_rejected_by_employees_id" FOREIGN KEY ("rejected_by") REFERENCES "hrm"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

create view payroll.payroll_contributions_view
as
 SELECT e.id,
    e.basic_salary,
    s.ee_contribution AS ss_ee_amount,
    s.er_contribution AS ss_er_amount,
    s.er_ec_contribution AS ss_er_ec_amount,
    s.wisp_er_contribution as sss_wisp_er,
    s.wisp_ee_contribution as sss_wisp_ee,
    (s.er_contribution + s.er_ec_contribution) AS ss_er_total,
    ((s.er_contribution + s.er_ec_contribution) + s.ee_contribution) AS ss_total,
    (((e.basic_salary * (p.rate / (100)::numeric)) / (2)::numeric))::numeric(15,2) AS phic_ee_amount,
    (((e.basic_salary * (p.rate / (100)::numeric)) / (2)::numeric))::numeric(15,2) AS phic_er_amount,
    ((e.basic_salary * (h.ee_rate / (100)::numeric)))::numeric(15,2) AS hdmf_ee_amount,
    ((e.basic_salary * (h.er_rate / (100)::numeric)))::numeric(15,2) AS hdmf_er_amount
   FROM (((hrm.employees e
     LEFT JOIN payroll.sss_contribution s ON (((e.basic_salary >= s.min_amount) AND ((e.basic_salary <= s.max_amount) OR
     (s.max_amount IS NULL)) AND ((s.max_amount IS NULL) OR (e.basic_salary <= s.max_amount)))))
     LEFT JOIN payroll.phic_contribution p ON (((e.basic_salary >= p.min_amount) AND ((e.basic_salary <= p.max_amount) OR
     (p.max_amount IS NULL)) AND ((p.max_amount IS NULL) OR (e.basic_salary <= p.max_amount)))))
     LEFT JOIN payroll.hdmf_contribution h ON (((e.basic_salary >= h.min_amount) AND ((e.basic_salary <= h.max_amount) OR (
     h.max_amount IS NULL)) AND ((h.max_amount IS NULL) OR (e.basic_salary <= h.max_amount)))))
  WHERE (e.is_active IS TRUE);