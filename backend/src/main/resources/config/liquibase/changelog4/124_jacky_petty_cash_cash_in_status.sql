ALTER TABLE accounting.petty_cash_cash_in
    ADD COLUMN posted boolean NOT NULL DEFAULT false,
    ADD COLUMN status varchar(20) NOT NULL DEFAULT 'DRAFT';

-- Cash In rows created before the Draft/Posted workflow were already included
-- in the on-hand balance, so preserve their financial effect.
UPDATE accounting.petty_cash_cash_in
SET posted = true,
    status = 'POSTED';
