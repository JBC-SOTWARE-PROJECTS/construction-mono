ALTER TABLE projects.project_costs
    ADD COLUMN IF NOT EXISTS invoice_id uuid,
    ADD COLUMN IF NOT EXISTS invoice_item_id uuid;

CREATE INDEX IF NOT EXISTS project_costs_invoice_id ON projects.project_costs(invoice_id);
CREATE INDEX IF NOT EXISTS project_costs_invoice_item_id ON projects.project_costs(invoice_item_id);

ALTER TABLE accounting.ar_invoice_items
    ADD COLUMN IF NOT EXISTS uom varchar,
    ADD COLUMN IF NOT EXISTS relative_weight numeric,
    ADD COLUMN IF NOT EXISTS percentage numeric,

    ADD COLUMN IF NOT EXISTS qty_prev integer,
    ADD COLUMN IF NOT EXISTS qty_this_period integer,
    ADD COLUMN IF NOT EXISTS qty_to_date integer,
    ADD COLUMN IF NOT EXISTS qty_balance integer,

    ADD COLUMN IF NOT EXISTS amount_prev numeric,
    ADD COLUMN IF NOT EXISTS amount_this_period numeric,
    ADD COLUMN IF NOT EXISTS amount_to_date numeric,
    ADD COLUMN IF NOT EXISTS amount_balance numeric,

    ADD COLUMN IF NOT EXISTS project_id uuid,
    ADD COLUMN IF NOT EXISTS project_costs_id uuid;

CREATE INDEX IF NOT EXISTS ar_invoice_items_project_id ON accounting.ar_invoice_items(project_id);
CREATE INDEX IF NOT EXISTS ar_invoice_items_project_costs_id ON accounting.ar_invoice_items(project_costs_id);