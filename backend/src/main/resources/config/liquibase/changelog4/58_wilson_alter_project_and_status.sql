ALTER TABLE projects.projects ADD COLUMN IF NOT EXISTS prefix_short_name varchar default null,
ADD COLUMN IF NOT EXISTS project_color varchar default null;
ALTER TABLE billing.job_status ADD COLUMN IF NOT EXISTS status_color varchar default null;