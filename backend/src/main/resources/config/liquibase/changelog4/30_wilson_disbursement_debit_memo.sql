-- accounting.debit_memo definition

-- Drop table

-- DROP TABLE accounting.debit_memo;

CREATE TABLE accounting.debit_memo
(
    id                 uuid NOT NULL,
    transaction_type   uuid NULL,
    supplier           uuid NULL,
    bank               uuid NULL,
    company            uuid NULL,
    debit_no           varchar NULL,
    debit_date         date NULL,
    debit_type         varchar NULL,
    memo_amount        numeric NULL DEFAULT 0,
    ewt_amount         numeric NULL DEFAULT 0,
    discount           numeric NULL DEFAULT 0,
    applied_amount     numeric NULL DEFAULT 0.00,
    debit_category     varchar NULL,
    remarks            varchar NULL,
    status             varchar NULL DEFAULT 'DRAFT':: character varying,
    posted             bool NULL DEFAULT false,
    posted_ledger      uuid NULL,
    posted_by          varchar NULL,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT debit_memo_pkey PRIMARY KEY (id)
);


-- accounting.debit_memo_details definition

-- Drop table

-- DROP TABLE accounting.debit_memo_details;

CREATE TABLE accounting.debit_memo_details
(
    id                 uuid NOT NULL,
    trans_type         uuid NULL,
    debit_memo         uuid NULL,
    office             uuid NULL,
    project            uuid NULL,
    "type"             varchar NULL,
    "percent"          numeric NULL DEFAULT 0,
    amount             numeric NULL DEFAULT 0,
    remarks            varchar NULL,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT debit_memo_details_pkey PRIMARY KEY (id)
);
-- accounting.debit_memo foreign keys

ALTER TABLE accounting.debit_memo
    ADD CONSTRAINT debit_memo_supplier_fkey FOREIGN KEY (supplier) REFERENCES inventory.supplier (id);
ALTER TABLE accounting.debit_memo
    ADD CONSTRAINT debit_memo_transaction_type_fkey FOREIGN KEY (transaction_type) REFERENCES accounting.ap_trans_types (id);
ALTER TABLE accounting.debit_memo
    ADD CONSTRAINT debit_memo_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);


-- accounting.debit_memo_details foreign keys

ALTER TABLE accounting.debit_memo_details
    ADD CONSTRAINT debit_memo_details_debit_memo_fkey FOREIGN KEY (debit_memo) REFERENCES accounting.debit_memo (id);
ALTER TABLE accounting.debit_memo_details
    ADD CONSTRAINT debit_memo_details_office_fkey FOREIGN KEY (office) REFERENCES public.office (id);
ALTER TABLE accounting.debit_memo_details
    ADD CONSTRAINT debit_memo_details_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);
ALTER TABLE accounting.debit_memo_details
    ADD CONSTRAINT debit_memo_details_trans_type_fkey FOREIGN KEY (trans_type) REFERENCES accounting.expense_trans_type (id);


-- indexes
CREATE INDEX idx_disbursement_company ON accounting.disbursement USING btree (company);
CREATE INDEX idx_debit_memo_company ON accounting.debit_memo USING btree (company);

CREATE INDEX idx_debit_memo_details_office ON accounting.debit_memo_details USING btree (office);
CREATE INDEX idx_debit_memo_details_project ON accounting.debit_memo_details USING btree (project);
CREATE INDEX idx_debit_memo_details ON accounting.debit_memo_details USING btree (debit_memo);
CREATE INDEX idx_debit_memo_details_trans_type ON accounting.debit_memo_details USING btree (trans_type);

DROP TABLE IF EXISTS accounting.disbursement_check;
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
    company          uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT disbursement_check_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_disbursement_check_bank ON accounting.disbursement_check USING btree (bank);
CREATE INDEX idx_disbursement_check ON accounting.disbursement_check USING btree (disbursement);
CREATE INDEX idx_disbursement_check_releasing ON accounting.disbursement_check USING btree (releasing);
CREATE INDEX idx_disbursement_check_company ON accounting.disbursement_check USING btree (company);