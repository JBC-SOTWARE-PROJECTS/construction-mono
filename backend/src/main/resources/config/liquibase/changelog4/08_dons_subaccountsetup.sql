CREATE TABLE IF NOT EXISTS accounting.subaccount (
    id uuid NULL,
    account_name varchar NULL,
    description varchar NULL,
    subaccount_code varchar NULL,
    parent_account uuid NULL,
    subaccount_parent uuid NULL,
    subaccount_type varchar NULL,
    subaccount_category varchar NULL,
    source_domain varchar NULL,

    domain_includes jsonb DEFAULT '[]',
    domain_excludes jsonb DEFAULT '[]',

    "created_by" varchar NULL COLLATE "default",
    "created_date" timestamp  NULL DEFAULT current_timestamp,
    "last_modified_by" varchar COLLATE "default",
    "last_modified_date" timestamp NULL DEFAULT current_timestamp,

    CONSTRAINT subaccount_setup_pk PRIMARY KEY (id),
    CONSTRAINT unique_constraint_subaccount UNIQUE (subaccount_code,account_name,parent_account,subaccount_parent),
    CONSTRAINT subaccount_setup_fk_parent FOREIGN KEY (parent_account) REFERENCES accounting.parent_account(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT subaccount_setup_fk_sub_parent FOREIGN KEY (subaccount_parent) REFERENCES accounting.subaccount(id) ON DELETE SET NULL ON UPDATE CASCADE
);
