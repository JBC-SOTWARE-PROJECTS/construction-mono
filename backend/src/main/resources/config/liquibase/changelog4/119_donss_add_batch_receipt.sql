CREATE TABLE IF NOT EXISTS cashier.batch_receipt (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_code VARCHAR,
    receipt_type VARCHAR,
    receipt_current_no BIGINT,
    range_start BIGINT,
    range_end BIGINT,
    is_active BOOLEAN,
    terminal UUID
);

ALTER TABLE cashier.batch_receipt
ADD CONSTRAINT unique_batch_code UNIQUE (batch_code);

ALTER TABLE cashier.batch_receipt
ADD COLUMN IF NOT EXISTS company_id UUID,
ADD COLUMN IF NOT EXISTS created_by varchar(50) NULL,
ADD COLUMN IF NOT EXISTS created_date timestamp NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_modified_by varchar(50) NULL,
ADD COLUMN IF NOT EXISTS last_modified_date timestamp NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS deleted bool NULL;

