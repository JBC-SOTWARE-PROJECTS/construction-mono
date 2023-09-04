CREATE SCHEMA payroll;

DROP table if exists payroll.hdmf_contribution;
CREATE TABLE payroll.hdmf_contribution (
    id                  uuid NOT NULL PRIMARY KEY,
	min_amount          decimal(15,2) NOT NULL,
	max_amount          decimal(15,2) NOT NULL,
    ee_rate             decimal(15,2) NOT NULL,
    er_rate             decimal(15,2) NOT NULL,

	created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted             bool NULL
);


DROP table if exists payroll.phic_contribution;
CREATE TABLE payroll.phic_contribution (
    id                  uuid NOT NULL PRIMARY KEY,
	min_amount          decimal(15,2) NOT NULL,
	max_amount          decimal(15,2) NOT NULL,
    rate                decimal(15,2) NOT NULL,
    ee_rate             decimal(15,2) NOT NULL,
    er_rate             decimal(15,2) NOT NULL,

	created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted             bool NULL
);

DROP table if exists payroll.sss_contribution;
CREATE TABLE payroll.sss_contribution (
    id                  uuid NOT NULL PRIMARY KEY,
	min_amount          decimal(15,2) NOT NULL,
	max_amount          decimal(15,2) NOT NULL,
	monthly_salary_credit decimal(15,2) NOT NULL,
    ee_contribution     decimal(15,2) NOT NULL,
    er_contribution     decimal(15,2) NOT NULL,
    er_ec_contribution  decimal(15,2) NOT NULL,

	created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted             bool NULL
);

