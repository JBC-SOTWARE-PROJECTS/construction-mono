DROP TABLE IF EXISTS projects.projects_updates_workers;
CREATE TABLE projects.projects_updates_workers
(
    id                 uuid NOT NULL PRIMARY KEY,
    project            uuid NULL,
    project_updates    uuid NULL,
    date_transact      timestamp NULL DEFAULT now(),
    position           varchar NULL,
    am_shift           int NULL,
    pm_shift           int NULL,
    remarks            varchar NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL
);

ALTER TABLE projects.projects_updates_workers
    ADD CONSTRAINT projects_updates_workers_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);

ALTER TABLE projects.projects_updates_workers
    ADD CONSTRAINT projects_updates_workers_project_updates_fkey FOREIGN KEY (project_updates) REFERENCES projects.project_updates (id);

CREATE INDEX IF NOT EXISTS projects_updates_workers_project_idx ON projects.projects_updates_workers (project);
CREATE INDEX IF NOT EXISTS projects_updates_workers_project_updates_idx ON projects.projects_updates_workers (project_updates);