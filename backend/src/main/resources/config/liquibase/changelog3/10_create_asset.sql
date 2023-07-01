CREATE SCHEMA IF NOT EXISTS asset;

CREATE TABLE asset.assets (
    id                  uuid not null primary key,
    code                varchar,
    description         varchar,
    brand               varchar,
    make                varchar,
    plate_no            varchar,
    image               text null,
    status              varchar,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL
);