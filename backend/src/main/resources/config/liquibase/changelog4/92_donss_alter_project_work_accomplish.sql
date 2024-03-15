ALTER TABLE projects.project_work_accomplish
ADD COLUMN IF NOT EXISTS billing_id uuid,
ADD COLUMN IF NOT EXISTS billing_no varchar;

ALTER TABLE billing.billing
ADD COLUMN IF NOT EXISTS project_work_accomplish_id uuid,
ADD COLUMN IF NOT EXISTS project_work_accomplish_no varchar;

ALTER TABLE billing.billing_item
ADD COLUMN IF NOT EXISTS project_work_accomplishment_item_id uuid,
ADD COLUMN IF NOT EXISTS project_cost_id uuid;
