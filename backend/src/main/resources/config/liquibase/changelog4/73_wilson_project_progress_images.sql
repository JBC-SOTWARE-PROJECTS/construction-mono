DROP TABLE IF EXISTS projects.project_progress_images;
CREATE TABLE projects.project_progress_images
(
    id                 uuid NOT NULL PRIMARY KEY,
    project_progress   uuid NULL,
    project            uuid NULL,
    date_transact      timestamp NULL DEFAULT now(),
    folder_name        varchar null,
    file_name          varchar null,
    mimetype           varchar null,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL
);


-- projects.projects_updates_materials foreign keys
ALTER TABLE projects.project_progress_images
    ADD CONSTRAINT project_progress_images_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);
ALTER TABLE projects.project_progress_images
    ADD CONSTRAINT project_progress_images_project_progress_fkey FOREIGN KEY (project_progress) REFERENCES projects.project_progress (id);

CREATE INDEX IF NOT EXISTS project_progress_images_project_idx ON projects.project_progress_images (project);
CREATE INDEX IF NOT EXISTS project_progress_images_project_progress_idx ON projects.project_progress_images (project_progress);
