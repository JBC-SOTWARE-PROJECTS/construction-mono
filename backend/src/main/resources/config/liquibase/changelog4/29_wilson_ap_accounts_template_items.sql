CREATE TABLE accounting.ap_account_templates_items
(
    id                 uuid NOT NULL,
    accounts_template  uuid NULL,
    code               varchar NULL,
    description        varchar NULL,
    account_type        varchar NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT ap_account_templates_items_pkey PRIMARY KEY (id)
);
CREATE INDEX if not exists idx_accounts_template_ap_account_templates_items ON accounting.ap_account_templates_items (accounts_template);
-- accounting.ap_trans_types foreign keys

ALTER TABLE accounting.ap_account_templates_items
    ADD CONSTRAINT ap_account_templates_items_accounts_template_fkey FOREIGN KEY (accounts_template) REFERENCES accounting.ap_account_templates (id);