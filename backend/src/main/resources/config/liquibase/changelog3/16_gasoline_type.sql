CREATE TABLE asset.gas_type (
    id                  uuid not null primary key,
    code                varchar,
    description         varchar,
    unit                varchar,
    active              bool,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL
);

CREATE TABLE asset.repair_history (
    id                  uuid not null primary key,
    ref_no              varchar,
    description         varchar,
    project             uuid null,
    asset               uuid null,
    remarks             varchar,
    status              varchar,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL
);

CREATE TABLE asset.repair_details (
    id                  uuid not null primary key,
    date_transact       timestamp NULL DEFAULT now(),
    description         varchar,
    item                uuid null,
    repair_history      uuid null,
    qty                 int default 0,
    cost                numeric default 0,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL
);