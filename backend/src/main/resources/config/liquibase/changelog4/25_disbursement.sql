-- accounting.disbursement definition

-- Drop table

-- DROP TABLE accounting.disbursement;

CREATE TABLE accounting.disbursement
(
    id                 uuid NOT NULL,
    payee_name         varchar NULL,
    dis_no             varchar NULL,
    supplier           uuid NULL,
    trans_type         uuid NULL,
    payment_cat        varchar NULL,
    dis_type           varchar NULL,
    dis_date           date NULL,
    cash               numeric default 0,
    checks             numeric default 0,
    discount_amount    numeric default 0,
    ewt_amount         numeric default 0,
    voucher_amount     numeric default 0,
    applied_amount     numeric default 0,
    status             varchar NULL,
    is_advance         bool NULL,
    posted             bool NULL,
    posted_by          varchar NULL,
    posted_ledger      uuid NULL,
    remarks_notes      varchar NULL,
    company            uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT disbursement_pkey PRIMARY KEY (id)
);


-- accounting.disbursement_ap definition

-- Drop table

-- DROP TABLE accounting.disbursement_ap;

CREATE TABLE accounting.disbursement_ap
(
    id                 uuid NOT NULL,
    disbursement       uuid NULL,
    payable            uuid NULL,
    reapplication      uuid NULL,
    office             uuid NULL,
    project            uuid NULL,
    applied_amount     numeric NULL,
    ewt_desc           varchar NULL,
    ewt_rate           numeric NULL,
    ewt_amount         numeric NULL,
    gross_amount       numeric NULL,
    discount           numeric NULL,
    net_amount         numeric NULL,

    vat_rate           numeric NULL DEFAULT 0,
    vat_inclusive      bool NULL DEFAULT false,
    vat_amount         numeric NULL DEFAULT 0,
    posted             bool NULL DEFAULT false,
    debit_memo         uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,


    CONSTRAINT disbursement_ap_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_disbursement_ap ON accounting.disbursement_ap USING btree (disbursement);
CREATE INDEX idx_disbursement_debit_memo ON accounting.disbursement_ap USING btree (debit_memo);
CREATE INDEX idx_disbursement_payable ON accounting.disbursement_ap USING btree (payable);
CREATE INDEX idx_disbursement_reapplication ON accounting.disbursement_ap USING btree (reapplication);
CREATE INDEX idx_disbursement_office ON accounting.disbursement_ap USING btree (office);
CREATE INDEX idx_disbursement_project ON accounting.disbursement_ap USING btree (project);


-- accounting.disbursement_check definition

-- Drop table

-- DROP TABLE accounting.disbursement_check;

CREATE TABLE accounting.disbursement_check
(
    id                 uuid NOT NULL,
    disbursement       uuid NULL,
    bank               uuid NULL,
    bank_branch        varchar NULL,
    check_date         date NULL,
    check_no           varchar NULL,
    amount             numeric NULL,
    releasing          uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT disbursement_check_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_disbursement_bank ON accounting.disbursement_check USING btree (bank);
CREATE INDEX idx_disbursement_check ON accounting.disbursement_check USING btree (disbursement);
CREATE INDEX idx_disbursement_releasing ON accounting.disbursement_check USING btree (releasing);


-- accounting.disbursement_exp definition

-- Drop table

-- DROP TABLE accounting.disbursement_exp;

CREATE TABLE accounting.disbursement_exp
(
    id                 uuid NOT NULL,
    disbursement       uuid NULL,
    trans_type         uuid NULL,
    office             uuid NULL,
    project            uuid NULL,
    amount             numeric NULL DEFAULT 0,
    remarks            varchar NULL,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT disbursement_exp_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_disbursement_exp_office ON accounting.disbursement_exp USING btree (office);
CREATE INDEX idx_disbursement_ex_project ON accounting.disbursement_exp USING btree (project);
CREATE INDEX idx_disbursement_exp ON accounting.disbursement_exp USING btree (disbursement);
CREATE INDEX idx_disbursement_exp_trans_type ON accounting.disbursement_exp USING btree (trans_type);


-- accounting.disbursement_wtx definition

-- Drop table

-- DROP TABLE accounting.disbursement_wtx;

CREATE TABLE accounting.disbursement_wtx
(
    id                 uuid NOT NULL,
    disbursement       uuid NULL,
    applied_amount     numeric NULL DEFAULT 0,
    vat_rate           numeric NULL DEFAULT 0,
    vat_inclusive      bool NULL DEFAULT true,
    vat_amount         numeric NULL DEFAULT 0,
    ewt_desc           varchar NULL,
    ewt_rate           numeric NULL DEFAULT 0,
    ewt_amount         numeric NULL DEFAULT 0,
    gross_amount       numeric NULL DEFAULT 0,
    net_amount         numeric NULL DEFAULT 0,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,


    CONSTRAINT disbursement_wtx_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_disbursement_wtx ON accounting.disbursement_wtx USING btree (disbursement);


-- accounting.reapplication definition

-- Drop table

-- DROP TABLE accounting.reapplication;

CREATE TABLE accounting.reapplication
(
    id                 uuid NOT NULL,
    transaction_type   uuid NULL,
    supplier           uuid NULL,
    disbursement       uuid NULL,
    rp_no              varchar NULL,
    discount_amount    numeric NULL DEFAULT 0,
    ewt_amount         numeric NULL DEFAULT 0,
    applied_amount     numeric NULL DEFAULT 0,
    prev_applied       numeric NULL DEFAULT 0,
    rounding           int4 NULL DEFAULT 2,
    is_posted          bool NULL DEFAULT false,
    posted_ledger      uuid NULL,
    status             varchar NULL,
    remarks            varchar NULL,
    company            uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT reapplication_pkey PRIMARY KEY (id)
);


-- accounting.disbursement foreign keys

ALTER TABLE accounting.disbursement
    ADD CONSTRAINT disbursement_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier (id);
ALTER TABLE accounting.disbursement
    ADD CONSTRAINT disbursement_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);


-- accounting.disbursement_ap foreign keys

ALTER TABLE accounting.disbursement_ap
    ADD CONSTRAINT disbursement_ap_disbursement_fkey FOREIGN KEY (disbursement) REFERENCES accounting.disbursement (id);
ALTER TABLE accounting.disbursement_ap
    ADD CONSTRAINT disbursement_ap_payable_fkey FOREIGN KEY (payable) REFERENCES accounting.payables (id);
ALTER TABLE accounting.disbursement_ap
    ADD CONSTRAINT disbursement_ap_office_fkey FOREIGN KEY (office) REFERENCES public.office (id);
ALTER TABLE accounting.disbursement_ap
    ADD CONSTRAINT disbursement_ap_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);


-- accounting.disbursement_check foreign keys

ALTER TABLE accounting.disbursement_check
    ADD CONSTRAINT disbursement_check_bank_fkey FOREIGN KEY (bank) REFERENCES accounting.bankaccounts (id);
ALTER TABLE accounting.disbursement_check
    ADD CONSTRAINT disbursement_check_disbursement_fkey FOREIGN KEY (disbursement) REFERENCES accounting.disbursement (id);


-- accounting.disbursement_exp foreign keys

ALTER TABLE accounting.disbursement_exp
    ADD CONSTRAINT disbursement_exp_office_fkey FOREIGN KEY (office) REFERENCES public.office (id);
ALTER TABLE accounting.disbursement_exp
    ADD CONSTRAINT disbursement_exp_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);
ALTER TABLE accounting.disbursement_exp
    ADD CONSTRAINT disbursement_exp_disbursement_fkey FOREIGN KEY (disbursement) REFERENCES accounting.disbursement (id);
ALTER TABLE accounting.disbursement_exp
    ADD CONSTRAINT disbursement_exp_trans_type_fkey FOREIGN KEY (trans_type) REFERENCES accounting.expense_trans_type (id);


-- accounting.disbursement_wtx foreign keys

ALTER TABLE accounting.disbursement_wtx
    ADD CONSTRAINT disbursement_wtx_disbursement_fkey FOREIGN KEY (disbursement) REFERENCES accounting.disbursement (id);


-- accounting.reapplication foreign keys

ALTER TABLE accounting.reapplication
    ADD CONSTRAINT reapplication_disbursement_fkey FOREIGN KEY (disbursement) REFERENCES accounting.disbursement (id);
ALTER TABLE accounting.reapplication
    ADD CONSTRAINT reapplication_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier (id);
ALTER TABLE accounting.reapplication
    ADD CONSTRAINT reapplication_transaction_type_fkey FOREIGN KEY (transaction_type) REFERENCES accounting.ap_trans_types (id);
ALTER TABLE accounting.reapplication
    ADD CONSTRAINT reapplication_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);