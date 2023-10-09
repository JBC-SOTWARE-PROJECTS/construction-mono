CREATE TABLE accounting.ap_account_templates
(
    id                 uuid NOT NULL,
    supplier_type      uuid NULL,
    company            uuid NULL,
    description        varchar NULL,
    ap_category        varchar NULL,
    status             bool NULL,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT ap_account_templates_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_ap_account_templates_company ON accounting.ap_account_templates USING btree (company);


-- accounting.ap_trans_types foreign keys

ALTER TABLE accounting.ap_account_templates
    ADD CONSTRAINT ap_account_templates_supplier_type_fkey FOREIGN KEY (supplier_type) REFERENCES inventory.supplier_types (id);