ALTER TABLE projects.project_updates ADD COLUMN start_date timestamp NULL DEFAULT now(),
ADD COLUMN estimate_end_date timestamp NULL DEFAULT now(),
ADD COLUMN completed_date timestamp NULL DEFAULT now();