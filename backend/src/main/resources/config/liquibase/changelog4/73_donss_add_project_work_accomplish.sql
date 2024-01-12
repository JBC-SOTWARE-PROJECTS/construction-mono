CREATE TABLE IF NOT EXISTS projects.project_work_accomplish
(
    id                  uuid NOT NULL PRIMARY KEY,
    record_no           varchar,
    project             uuid NULL,
    period_start        varchar,
    period_end          varchar,

    total_amount            numeric,
    total_payments          numeric,
    total_prev_amount       numeric,
    total_period_amount     numeric,
    total_to_date_amount    numeric,
    total_balance_amount    numeric,
    total_percentage        numeric,

    prepared_by         varchar,
    verified_by         varchar,
    checked_by          varchar,

    recommending_approval          varchar,
    approved_for_approval          varchar,

    status             varchar NULL,
    company_id         uuid,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL
);


CREATE TABLE IF NOT EXISTS projects.project_work_accomplish_items
(
    id                  uuid NOT NULL PRIMARY KEY,
    project_work_accomplish_id uuid NULL,
    project             uuid NULL,
    project_cost        uuid NULL,
    period_start        varchar,
    period_end          varchar,

    item_no            varchar,
    description        varchar,
    unit               varchar,
    qty                numeric,
    cost               numeric,
    payments           numeric,
    relative_weight    numeric,
    prev_qty           numeric,
    this_period_qty    numeric,
    to_date_qty        numeric,
    balance_qty        numeric,
    prev_amount        numeric,
    this_period_amount numeric,
    to_date_amount     numeric,
    balance_amount     numeric,
    percentage         numeric,

    status             varchar NULL,
    company_id         uuid,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL
);


ALTER TABLE projects.project_costs
ADD COLUMN IF  NOT EXISTS billed_qty numeric,
ADD COLUMN IF  NOT EXISTS relative_weight numeric,
ADD COLUMN IF  NOT EXISTS item_no varchar;

ALTER TABLE projects.projects
ADD COLUMN IF  NOT EXISTS contract_id varchar;
