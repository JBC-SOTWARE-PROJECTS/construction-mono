ALTER TABLE accounting.petty_cash ADD COLUMN amount_replenish numeric default 0,
    ADD COLUMN balance numeric default 0;