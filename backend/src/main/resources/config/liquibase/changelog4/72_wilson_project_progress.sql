DROP TABLE IF EXISTS projects.project_progress;
CREATE TABLE projects.project_progress
(
    id                 uuid NOT NULL PRIMARY KEY,
    trans_no           varchar NULL,
    project            uuid NULL,
    date_transact      timestamp NULL DEFAULT now(),
    description        varchar NULL,
    progress           text NULL,
    status             varchar NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL
);

ALTER TABLE projects.project_progress
    ADD CONSTRAINT project_progress_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);

CREATE INDEX IF NOT EXISTS project_progress_project_idx ON projects.project_progress (project);
