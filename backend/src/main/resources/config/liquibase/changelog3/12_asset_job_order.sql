DROP TABLE IF EXISTS asset.job_order_items;
DROP TABLE IF EXISTS asset.job_order;

CREATE TABLE asset.job_order (
    id                  uuid not null primary key,
    date_transact       timestamp NULL DEFAULT now(),
    code                varchar,
    description         varchar,
    duration_start      timestamp NULL DEFAULT now(),
    duration_end        timestamp NULL DEFAULT now(),
    customer            uuid,
    project             uuid,
    asset               uuid,
    remarks             varchar,
    status              varchar,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL
);

CREATE TABLE asset.job_order_items (
    id                  uuid not null primary key,
    date_transact       timestamp NULL DEFAULT now(),
    job_order           uuid,
    code                varchar,
    description         varchar,
    type                varchar,
    qty                 numeric,
    unit                varchar,
    cost                numeric,
    sub_total           numeric,
    total               numeric,
    active              bool,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL
);