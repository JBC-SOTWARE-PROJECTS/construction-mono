-- accounting.ap_trans_types definition

-- Drop table

-- DROP TABLE accounting.ap_trans_types;

CREATE TABLE accounting.ap_trans_types
(
    id                 uuid NOT NULL,
    supplier_type      uuid NULL,
    company            uuid NULL,
    description        varchar NULL,
    ap_category        varchar NULL,
    flag_value         varchar NULL,

    status             bool NULL,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,


    CONSTRAINT ap_trans_types_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_ap_trans_types_company ON accounting.ap_trans_types USING btree (company);
-- accounting.ap_trans_types foreign keys

ALTER TABLE accounting.ap_trans_types
    ADD CONSTRAINT ap_trans_types_supplier_type_fkey FOREIGN KEY (supplier_type) REFERENCES inventory.supplier_types (id);