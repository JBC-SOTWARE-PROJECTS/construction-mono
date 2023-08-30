CREATE TABLE billing.discounts (
  id uuid NOT NULL,
  code varchar NULL,
  discount varchar NULL,
  remarks varchar NULL,
  created_by varchar(50) NULL,
  created_date timestamp NULL DEFAULT now(),
  last_modified_by varchar(50) NULL,
  last_modified_date timestamp NULL DEFAULT now(),
  "type" varchar NULL,
  value numeric(15,2) NULL,

  from_initial boolean NULL,
  vat boolean NULL,
  include_vat boolean NULL,
  validation_source varchar NULL,
  senior_pwd bool default false,

  active bool NULL,

  CONSTRAINT discounts_pkey PRIMARY KEY (id)
);
