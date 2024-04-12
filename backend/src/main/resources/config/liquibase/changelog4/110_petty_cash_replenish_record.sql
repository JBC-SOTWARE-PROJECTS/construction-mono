DROP TABLE IF EXISTS accounting.petty_cash_replenish;
CREATE TABLE accounting.petty_cash_replenish
(
    id                 uuid NOT NULL PRIMARY KEY,
    trans_date         date NULL DEFAULT now(),
    petty_cash         uuid NULL,
    ref_no             varchar NULL,
    ref_id             uuid NULL,
    amount             numeric default 0,
    company            uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL
);

ALTER TABLE accounting.petty_cash_replenish
    ADD CONSTRAINT petty_cash_replenish_petty_cash_fkey FOREIGN KEY (petty_cash) REFERENCES accounting.petty_cash (id);
ALTER TABLE accounting.petty_cash_replenish
    ADD CONSTRAINT petty_cash_replenish_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);

CREATE INDEX IF NOT EXISTS petty_cash_replenish_petty_cash_idx ON accounting.petty_cash_replenish (petty_cash);
CREATE INDEX IF NOT EXISTS petty_cash_replenish_ref_id_idx ON accounting.petty_cash_replenish (ref_id);
CREATE INDEX IF NOT EXISTS petty_cash_replenish_ref_no_idx ON accounting.petty_cash_replenish (ref_no);
CREATE INDEX IF NOT EXISTS petty_cash_replenish_company_idx ON accounting.petty_cash_replenish (company);