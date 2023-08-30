drop table if exists "accounting"."parent_account";
create table if not exists accounting.parent_account
(
    id                             uuid NOT NULL,
    code                           varchar NULL,
    account_name                   varchar NULL,
    description                    varchar NULL,
    category                       varchar NULL,
    account_type                   varchar NULL,
    normal_side                    varchar NULL,
    is_contra                      bool NULL,
    deprecated                     bool NULL,
    company_id                     uuid NOT NULL,

    created_by                     varchar(50) NULL,
    created_date                   timestamp NULL DEFAULT now(),
    last_modified_by               varchar(50) NULL,
    last_modified_date             timestamp NULL DEFAULT now(),
    deleted                        bool,
    CONSTRAINT mother_account_pkey PRIMARY KEY (id)
);