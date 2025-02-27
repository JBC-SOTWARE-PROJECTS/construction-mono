ALTER TABLE accounting.integration
ADD COLUMN IF NOT EXISTS auto_post bool default true;