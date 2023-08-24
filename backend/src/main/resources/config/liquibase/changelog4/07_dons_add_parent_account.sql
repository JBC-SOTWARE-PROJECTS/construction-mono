drop table if exists "accounting"."parent_account";
create table accounting.parent_account
(
    id                             uuid NOT NULL,
    account_code                   varchar NULL,
    description                    varchar NULL,
    category                       boolean NULL,
    tags                           varchar NULL,
    parent                         uuid NULL,
    deprecated                     bool NULL,
    account_type                   varchar NULL,
    normal_side                    varchar NULL,
    is_contra                      bool NULL,

    created_by                     varchar(50) NULL,
    created_date                   timestamp NULL DEFAULT now(),
    last_modified_by               varchar(50) NULL,
    last_modified_date             timestamp NULL DEFAULT now(),
    deleted                        bool,

    CONSTRAINT mother_account_pkey PRIMARY KEY (id)
);