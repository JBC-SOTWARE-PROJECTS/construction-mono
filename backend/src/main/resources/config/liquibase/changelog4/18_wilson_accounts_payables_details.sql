-- accounting.payables_detials definition

-- Drop table

-- DROP TABLE accounting.payables_detials;

CREATE TABLE accounting.payables_detials
(
    id                 uuid NOT NULL,
    payables           uuid NULL,
    office             uuid NULL,
    project            uuid NULL,
    trans_type         uuid NULL,

    amount             numeric NULL,
    disc_rate          numeric NULL,
    disc_amount        numeric NULL,
    vat_inclusive      bool NULL,
    vat_amount         numeric NULL,
    tax_description    varchar NULL,
    ewt_rate           numeric NULL,
    ewt_amount         numeric NULL,
    net_amount         numeric NULL,
    remarks_notes      varchar NULL,
    ref_id             uuid NULL,
    ref_no             varchar NULL,
    "source"           varchar NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT payables_detials_pkey PRIMARY KEY (id)
);


-- accounting.payables_detials foreign keys

ALTER TABLE accounting.payables_detials
    ADD CONSTRAINT payables_detials_office_fkey FOREIGN KEY (office) REFERENCES public.office (id);
ALTER TABLE accounting.payables_detials
    ADD CONSTRAINT payables_detials_payables_fkey FOREIGN KEY (payables) REFERENCES accounting.payables (id);
ALTER TABLE accounting.payables_detials
    ADD CONSTRAINT payables_detials_trans_type_fkey FOREIGN KEY (trans_type) REFERENCES accounting.ap_trans_types (id);
ALTER TABLE accounting.payables_detials
    ADD CONSTRAINT payables_detials_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);