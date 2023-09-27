-- accounting.expense_trans_type definition

-- Drop table

-- DROP TABLE accounting.expense_trans_type;

CREATE TABLE accounting.expense_trans_type
(
    id                 uuid NOT NULL,
    description        varchar NULL,
    "type"             varchar NULL,
    "source"           varchar NULL,
    is_active          bool NULL DEFAULT false,
    remarks            varchar NULL,
    is_reverse         bool NULL DEFAULT false,
    company            uuid default null,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT expense_trans_type_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_expense_trans_type_company ON accounting.expense_trans_type USING btree (company);

ALTER TABLE accounting.expense_trans_type
    ADD CONSTRAINT expense_trans_type_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);