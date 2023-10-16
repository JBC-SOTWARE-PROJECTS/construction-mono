-- accounting.ap_ledger definition

-- Drop table

-- DROP TABLE accounting.ap_ledger;

CREATE TABLE accounting.ap_ledger
(
    id                 uuid NOT NULL,
    supplier           uuid NULL,
    ledger_type        varchar NULL,
    ledger_date        timestamp NULL DEFAULT now(),
    ref_no             varchar NULL,
    ref_id             uuid NULL,
    debit              numeric NULL,
    credit             numeric NULL,
    is_include         bool NULL,
    company            uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT ap_ledger_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_ap_ledger_company ON accounting.ap_ledger USING btree (company);

-- accounting.ap_ledger foreign keys

ALTER TABLE accounting.ap_ledger
    ADD CONSTRAINT ap_ledger_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier (id);

ALTER TABLE accounting.ap_ledger
    ADD CONSTRAINT ap_ledger_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);