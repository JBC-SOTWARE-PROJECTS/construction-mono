CREATE TABLE asset.vehicle_usage_expense
(
    id                 uuid          NOT NULL PRIMARY KEY,
    vehicle_usage      uuid          NOT NULL,
    expense_type       varchar(20)   NOT NULL,
    item               uuid,
    particulars        varchar(500)  NOT NULL,
    quantity           numeric,
    amount             numeric(19,2) NOT NULL,
    company            uuid          NOT NULL,
    created_by         varchar(50)   NOT NULL,
    created_date       timestamp     NOT NULL DEFAULT now(),
    last_modified_by   varchar(50),
    last_modified_date timestamp,
    deleted            boolean       NOT NULL DEFAULT false,

    CONSTRAINT vehicle_usage_expense_type_check
        CHECK (expense_type IN ('ITEM', 'SERVICE', 'CUSTOM')),
    CONSTRAINT vehicle_usage_expense_vehicle_usage_fkey
        FOREIGN KEY (vehicle_usage) REFERENCES asset.vehicle_usage_monitoring (id),
    CONSTRAINT vehicle_usage_expense_item_fkey
        FOREIGN KEY (item) REFERENCES inventory.item (id),
    CONSTRAINT vehicle_usage_expense_company_fkey
        FOREIGN KEY (company) REFERENCES public.company (id)
);

CREATE INDEX vehicle_usage_expense_usage_company_idx
    ON asset.vehicle_usage_expense (vehicle_usage, company);
