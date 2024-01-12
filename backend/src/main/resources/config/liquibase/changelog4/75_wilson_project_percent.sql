ALTER TABLE projects.projects ADD COLUMN IF NOT EXISTS project_percent numeric default 0;
ALTER TABLE projects.project_progress ADD COLUMN IF NOT EXISTS progress_percent numeric default 0;