DROP TABLE IF EXISTS accounting.disbursement_petty_cash;
CREATE TABLE accounting.disbursement_petty_cash
(
    id                 uuid NOT NULL PRIMARY KEY,
    petty_cash         uuid NULL,
    disbursement       uuid NULL,
    debit_memo         uuid NULL,
    amount             numeric default 0,
    company            uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL
);

ALTER TABLE accounting.disbursement_petty_cash
    ADD CONSTRAINT disbursement_petty_cash_petty_cash_fkey FOREIGN KEY (petty_cash) REFERENCES accounting.petty_cash (id);
ALTER TABLE accounting.disbursement_petty_cash
    ADD CONSTRAINT disbursement_petty_cash_disbursement_fkey FOREIGN KEY (disbursement) REFERENCES accounting.disbursement (id);
ALTER TABLE accounting.disbursement_petty_cash
    ADD CONSTRAINT disbursement_petty_cash_debit_memo_fkey FOREIGN KEY (debit_memo) REFERENCES accounting.debit_memo (id);
ALTER TABLE accounting.disbursement_petty_cash
    ADD CONSTRAINT disbursement_petty_cash_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);

CREATE INDEX IF NOT EXISTS petty_cash_replenish_petty_cash_idx ON accounting.disbursement_petty_cash (petty_cash);
CREATE INDEX IF NOT EXISTS petty_cash_replenish_ref_id_idx ON accounting.disbursement_petty_cash (disbursement);
CREATE INDEX IF NOT EXISTS petty_cash_replenish_ref_no_idx ON accounting.disbursement_petty_cash (debit_memo);
CREATE INDEX IF NOT EXISTS petty_cash_replenish_company_idx ON accounting.disbursement_petty_cash (company);