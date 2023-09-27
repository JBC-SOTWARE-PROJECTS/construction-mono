-- accounting.payables definition

-- Drop table

-- DROP TABLE accounting.payables;

CREATE TABLE accounting.payables
(
    id                 uuid NOT NULL,
    receiving          uuid NULL,
    supplier           uuid NULL,
    company            uuid NULL,
    trans_type         uuid NULL,

    ap_no              varchar NULL,
    apv_date           date NULL,
    due_date           date NULL,
    ap_category        varchar NULL,
    payment_terms      uuid NULL,
    invoice_no         varchar NULL,

    gross_amount       numeric NULL,
    discount_amount    numeric NULL,
    net_of_discount    numeric NULL,
    vat_rate           numeric NULL,
    vat_inclusive      bool NULL,
    vat_amount         numeric NULL,
    net_of_vat         numeric NULL,
    ewt_amount         numeric NULL,
    net_amount         numeric NULL,

    applied_amount     numeric NULL DEFAULT 0,
    disbursement       varchar NULL,


    da_amount          numeric NULL DEFAULT 0.00,
    dm_amount          numeric NULL DEFAULT 0.00,
    dm_ref_no          varchar NULL,

    status             varchar NULL,
    remarks_notes      varchar NULL,
    posted             bool NULL,
    posted_by          varchar NULL,
    posted_ledger      uuid NULL,

    rounding           int4 NULL DEFAULT 2,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT payables_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_payables_receiving ON accounting.payables USING btree (receiving);
CREATE INDEX idx_payables_supplier ON accounting.payables USING btree (supplier);
CREATE INDEX idx_payables_company ON accounting.payables USING btree (company);

-- accounting.payables foreign keys

ALTER TABLE accounting.payables
    ADD CONSTRAINT payables_payment_terms_fkey FOREIGN KEY (payment_terms) REFERENCES inventory.payment_terms (id);
ALTER TABLE accounting.payables
    ADD CONSTRAINT payables_receiving_fkey FOREIGN KEY (receiving) REFERENCES inventory.receiving_report (id);
ALTER TABLE accounting.payables
    ADD CONSTRAINT payables_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier (id);
ALTER TABLE accounting.payables
    ADD CONSTRAINT payables_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);