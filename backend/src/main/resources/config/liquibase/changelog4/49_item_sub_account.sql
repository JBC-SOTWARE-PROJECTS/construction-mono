DROP TABLE IF EXISTS inventory.item_sub_account;
CREATE TABLE IF NOT EXISTS inventory.item_sub_account
(
    id                           uuid NOT NULL,
    item_sub_account_code        varchar(255) NULL,
    item_sub_account_description varchar(255) NULL,
    account_type                 varchar NULL,
    source_column                varchar NULL,
    is_active                    bool NULL,
    is_fixed_asset               bool NULL DEFAULT false,
    company                      uuid NULL DEFAULT NULL,

    deleted                      bool NULL,
    created_by                   varchar(50) NULL,
    created_date                 timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by             varchar(50) NULL,
    last_modified_date           timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,

    foreign key (company) references public.company(id)
);
CREATE INDEX IF NOT EXISTS item_sub_account_company_idx ON inventory.item_sub_account (company);