ALTER TABLE accounting.ar_credit_note
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_credit_note_company_id ON accounting.ar_credit_note (company_id);

ALTER TABLE accounting.ar_credit_note_allocated_invoice
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_credit_note_allocated_invoice_company_id ON accounting.ar_credit_note_allocated_invoice (company_id);

ALTER TABLE accounting.ar_credit_note_items
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_credit_note_items_company_id ON accounting.ar_credit_note_items (company_id);

ALTER TABLE accounting.ar_customers
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_customers_company_id ON accounting.ar_customers (company_id);

ALTER TABLE accounting.ar_invoice
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_invoice_company_id ON accounting.ar_invoice (company_id);

ALTER TABLE accounting.ar_invoice_items
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_invoice_items_company_id ON accounting.ar_invoice_items (company_id);

ALTER TABLE accounting.ar_invoice_particulars
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_invoice_particulars_company_id ON accounting.ar_invoice_particulars (company_id);

ALTER TABLE accounting.ar_payment_posting
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_payment_posting_company_id ON accounting.ar_payment_posting (company_id);

ALTER TABLE accounting.ar_payment_posting_details
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_payment_posting_details_company_id ON accounting.ar_payment_posting_details (company_id);

ALTER TABLE accounting.ar_transaction_ledger
ADD COLUMN IF NOT EXISTS company_id uuid;

CREATE INDEX IF NOT EXISTS idx_ar_transaction_ledger_company_id ON accounting.ar_transaction_ledger (company_id);