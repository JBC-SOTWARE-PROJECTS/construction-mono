-- accounting.bankaccounts definition

-- Drop table

-- DROP TABLE accounting.bankaccounts;

CREATE TABLE accounting.bankaccounts
(
    id                 uuid NOT NULL,
    bankaccountid      varchar NULL,
    bankname           varchar NULL,
    branch             varchar NULL,
    bankaddress        varchar NULL,
    accountname        varchar NULL,
    accountnumber      varchar NULL,
    remarks            varchar NULL,
    acquiring_bank     bool NULL,
    company            uuid default NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool default false,

    CONSTRAINT bankaccounts_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_bankaccounts_company ON accounting.bankaccounts USING btree (company);

ALTER TABLE accounting.bankaccounts
    ADD CONSTRAINT bankaccounts_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);