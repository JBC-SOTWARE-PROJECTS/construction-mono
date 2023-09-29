-- accounting.wtx_2307 definition

-- Drop table

-- DROP TABLE accounting.wtx_2307;

CREATE TABLE accounting.wtx_2307
(
    id                 uuid NOT NULL,
    ref_id             uuid NULL,
    ref_no             varchar NULL,
    "type"             varchar NULL,
    wtx_date           date NULL,
    supplier           uuid NULL,
    gross              numeric NULL DEFAULT 0,
    vat_amount         numeric NULL DEFAULT 0,
    net_vat            numeric NULL DEFAULT 0,
    ewt_amount         numeric NULL DEFAULT 0,
    process            bool NULL DEFAULT false,
    wtx_consolidated   uuid NULL,
    source_doc_no      varchar NULL,
    company            uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT wtx_2307_pkey PRIMARY KEY (id)
);


-- accounting.wtx_consolidated definition

-- Drop table

-- DROP TABLE accounting.wtx_consolidated;

CREATE TABLE accounting.wtx_consolidated
(
    id                 uuid NOT NULL,
    ref_no             varchar NULL,
    supplier           uuid NULL,
    date_from          date NULL,
    date_to            date NULL,
    remarks            varchar NULL,
    company            uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT wtx_consolidated_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_wtx_2307_company ON accounting.wtx_2307 USING btree (company);
CREATE INDEX idx_wtx_consolidated_company ON accounting.wtx_consolidated USING btree (company);


-- accounting.wtx_2307 foreign keys

ALTER TABLE accounting.wtx_2307
    ADD CONSTRAINT wtx_2307_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier (id);
ALTER TABLE accounting.wtx_2307
    ADD CONSTRAINT wtx_2307_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);

-- accounting.wtx_consolidated foreign keys

ALTER TABLE accounting.wtx_consolidated
    ADD CONSTRAINT wtx_consolidated_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier (id);
ALTER TABLE accounting.wtx_consolidated
    ADD CONSTRAINT wtx_consolidated_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);
