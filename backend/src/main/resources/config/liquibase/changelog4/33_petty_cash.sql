-- accounting.petty_cash definition

-- Drop table

-- DROP TABLE accounting.petty_cash;

CREATE TABLE accounting.petty_cash
(
    id                 uuid NOT NULL,
    transaction_type   uuid NULL,
    company            uuid NULL,
    payee_name         varchar NULL,
    pcv_no             varchar NULL,
    pcv_date           date NULL,
    amount_issued      numeric NULL DEFAULT 0,
    amount_used        numeric NULL DEFAULT 0,
    amount_unused      numeric NULL DEFAULT 0,
    vat_inclusive      bool NULL DEFAULT false,
    vat_rate           numeric NULL DEFAULT 12,
    pcv_category       varchar NULL,
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

    CONSTRAINT petty_cash_pkey PRIMARY KEY (id)
);


-- accounting.petty_cash_others definition

-- Drop table

-- DROP TABLE accounting.petty_cash_others;

CREATE TABLE accounting.petty_cash_others
(
    id                 uuid NOT NULL,
    petty_cash         uuid NULL,
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
    CONSTRAINT petty_cash_others_pkey PRIMARY KEY (id)
);


-- accounting.petty_cash_purchases definition

-- Drop table

-- DROP TABLE accounting.petty_cash_purchases;

CREATE TABLE accounting.petty_cash_purchases
(
    id                 uuid NOT NULL,
    item               uuid NULL,
    office             uuid NULL,
    project            uuid NULL,
    petty_cash         uuid NULL,
    company            uuid NULL,
    qty                int4 NULL DEFAULT 0,
    unit_cost          numeric NULL DEFAULT 0,
    inventory_cost     numeric NULL DEFAULT 0,
    gross_amount       numeric NULL DEFAULT 0,
    disc_rate          numeric NULL DEFAULT 0,
    disc_amount        numeric NULL DEFAULT 0,
    net_discount       numeric NULL DEFAULT 0,
    expiration_date    date NULL,
    lot_no             varchar NULL,
    is_vat             bool NULL DEFAULT false,
    vat_amount         numeric NULL DEFAULT 0,
    net_amount         numeric NULL DEFAULT 0,
    is_posted          bool NULL DEFAULT false,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT petty_cash_purchases_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_petty_cash_purchases_office ON accounting.petty_cash_purchases USING btree (office);
CREATE INDEX idx_petty_cash_company_office ON accounting.petty_cash_purchases USING btree (company);
CREATE INDEX idx_petty_cash_purchases_project ON accounting.petty_cash_purchases USING btree (project);
CREATE INDEX idx_petty_cash_purchases_item ON accounting.petty_cash_purchases USING btree (item);
CREATE INDEX idx_petty_cash_purchases_petty_cash ON accounting.petty_cash_purchases USING btree (petty_cash);


-- accounting.petty_cash foreign keys

ALTER TABLE accounting.petty_cash
    ADD CONSTRAINT petty_cash_transaction_type_fkey FOREIGN KEY (transaction_type) REFERENCES accounting.ap_trans_types (id);
ALTER TABLE accounting.petty_cash
    ADD CONSTRAINT petty_cash_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);


-- accounting.petty_cash_others foreign keys

ALTER TABLE accounting.petty_cash_others
    ADD CONSTRAINT petty_cash_others_office_fkey FOREIGN KEY (office) REFERENCES public.departments (id);
ALTER TABLE accounting.petty_cash_others
    ADD CONSTRAINT petty_cash_others_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);
ALTER TABLE accounting.petty_cash_others
    ADD CONSTRAINT petty_cash_others_petty_cash_fkey FOREIGN KEY (petty_cash) REFERENCES accounting.petty_cash (id);
ALTER TABLE accounting.petty_cash_others
    ADD CONSTRAINT petty_cash_others_trans_type_fkey FOREIGN KEY (trans_type) REFERENCES accounting.expense_trans_type (id);


-- accounting.petty_cash_purchases foreign keys

ALTER TABLE accounting.petty_cash_purchases
    ADD CONSTRAINT petty_cash_purchases_department_fkey FOREIGN KEY (office) REFERENCES public.departments (id);
ALTER TABLE accounting.petty_cash_purchases
    ADD CONSTRAINT petty_cash_others_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);
ALTER TABLE accounting.petty_cash_purchases
    ADD CONSTRAINT petty_cash_purchases_item_fkey FOREIGN KEY (item) REFERENCES inventory.item (id);
ALTER TABLE accounting.petty_cash_purchases
    ADD CONSTRAINT petty_cash_purchases_petty_cash_fkey FOREIGN KEY (petty_cash) REFERENCES accounting.petty_cash (id);