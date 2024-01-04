DROP TABLE IF EXISTS projects.project_costs_revisions;
CREATE TABLE IF NOT EXISTS projects.project_costs_revisions
(
    id                           uuid NOT NULL PRIMARY KEY,
    prev_date                    timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
    project                      uuid NULL,
    project_cost_id              uuid NULL,
    qty                          numeric default 0,
    unit                         varchar NULL,
    cost                         numeric default 0,
    tag_no                       varchar NULL DEFAULT false,

    deleted                      bool NULL,
    created_by                   varchar(50) NULL,
    created_date                 timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by             varchar(50) NULL,
    last_modified_date           timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,

    foreign key (project) references projects.projects(id),
    foreign key (project_cost_id) references projects.project_costs(id)
);
CREATE INDEX IF NOT EXISTS project_costs_revisions_project_idx ON projects.project_costs_revisions (project);
CREATE INDEX IF NOT EXISTS project_costs_revisions_project_cost_id_idx ON projects.project_costs_revisions (project_cost_id);