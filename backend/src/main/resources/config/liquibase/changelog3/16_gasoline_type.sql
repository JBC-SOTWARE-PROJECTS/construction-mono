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

CREATE TABLE asset.gas_ledger (
    id                  uuid not null primary key,
    ref_no                varchar,
    description         varchar,
    active              bool,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL
);