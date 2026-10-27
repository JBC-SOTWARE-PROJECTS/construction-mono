CREATE TABLE accounting.petty_cash_cash_in
(
    id                 uuid         NOT NULL PRIMARY KEY,
    trans_date         date         NOT NULL DEFAULT CURRENT_DATE,
    reference_no       varchar(100),
    description        varchar(500),
    amount             numeric(19,2) NOT NULL DEFAULT 0,
    company            uuid         NOT NULL,
    created_by         varchar(50)  NOT NULL,
    created_date       timestamp    NOT NULL DEFAULT now(),
    last_modified_by   varchar(50),
    last_modified_date timestamp
);

ALTER TABLE accounting.petty_cash_cash_in
    ADD CONSTRAINT petty_cash_cash_in_company_fkey
        FOREIGN KEY (company) REFERENCES public.company (id);

CREATE INDEX petty_cash_cash_in_company_date_idx
    ON accounting.petty_cash_cash_in (company, trans_date);
