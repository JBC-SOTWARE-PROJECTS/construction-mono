DROP TABLE IF EXISTS projects.projects_updates_notes;
DROP TABLE IF EXISTS projects.projects_updates_materials;
DROP TABLE IF EXISTS projects.project_updates;

CREATE TABLE projects.project_updates
(
    id                 uuid NOT NULL,
    project            uuid NULL,
    date_transact      timestamp NULL DEFAULT now(),
    accomplishment     text NULL,
    description        text NULL,
    weather            varchar NULL,
    status             varchar NULL,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT project_updates_pkey PRIMARY KEY (id)
);


-- projects.project_updates foreign keys
ALTER TABLE projects.project_updates
    ADD CONSTRAINT project_updates_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);

-- projects.projects_updates_materials definition

-- Drop table

-- DROP TABLE projects.projects_updates_materials;

CREATE TABLE projects.projects_updates_materials
(
    id                 uuid NOT NULL,
    project_updates    uuid NULL,
    project            uuid NULL,
    date_transact      timestamp NULL DEFAULT now(),
    item               uuid NULL,
    on_hand            int null DEFAULT 0,
    qty                int4 NULL DEFAULT 0,
    balance            int null DEFAULT 0,
    w_cost             numeric NULL DEFAULT 0,
    remarks            varchar null,
    ref_id             uuid NULL,

    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT projects_updates_materials_pkey PRIMARY KEY (id)
);


-- projects.projects_updates_materials foreign keys

ALTER TABLE projects.projects_updates_materials
    ADD CONSTRAINT projects_updates_materials_item_fkey FOREIGN KEY (item) REFERENCES inventory.item (id);
ALTER TABLE projects.projects_updates_materials
    ADD CONSTRAINT projects_updates_materials_project_fkey FOREIGN KEY (project) REFERENCES projects.projects (id);
ALTER TABLE projects.projects_updates_materials
    ADD CONSTRAINT projects_updates_materials_project_updates_fkey FOREIGN KEY (project_updates) REFERENCES projects.project_updates (id);