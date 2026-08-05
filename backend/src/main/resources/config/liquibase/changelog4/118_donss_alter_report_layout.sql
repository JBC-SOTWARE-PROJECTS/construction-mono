ALTER TABLE accounting.reports_layout
ADD COLUMN IF NOT EXISTS is_standard bool DEFAULT false;

ALTER TABLE accounting.reports_layout_item
ADD COLUMN IF NOT EXISTS account_type varchar;
