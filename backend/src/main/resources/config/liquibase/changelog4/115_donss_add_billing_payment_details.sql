CREATE TABLE IF NOT EXISTS billing.payment_amount_details (
    id uuid NOT NULL PRIMARY KEY,
    billing uuid,
    billing_item uuid,
    amount NUMERIC(10, 2) NOT NULL,
    ref_billing_item uuid,

    created_by varchar(50) NULL,
    created_date timestamp NULL DEFAULT now(),
    last_modified_by varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted bool NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_amount_details_billing_id ON billing.payment_amount_details(billing);
CREATE INDEX IF NOT EXISTS idx_payment_amount_details_billing_item_id ON billing.payment_amount_details(billing_item);
CREATE INDEX IF NOT EXISTS idx_payment_amount_details_ref_billing_item_id ON billing.payment_amount_details(ref_billing_item);
