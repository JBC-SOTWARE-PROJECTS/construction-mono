
CREATE TABLE projects.project_costs (
    id                  uuid not null primary key,
    project             uuid null,
    date_transact       timestamp NULL DEFAULT now(),
    description         varchar,
    cost                numeric null,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL,

    foreign key (project) references projects.projects(id)
);

CREATE TABLE projects.project_updates (
    id                  uuid not null primary key,
    project             uuid null,
    date_transact       timestamp NULL DEFAULT now(),
    description         text,
    status              varchar null,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL,

    foreign key (project) references projects.projects(id)
);

CREATE TABLE projects.project_materials (
    id                  uuid not null primary key,
    project             uuid null,
    date_transact       timestamp NULL DEFAULT now(),
    ref_id              uuid null,
    ref_no              varchar null,
    item                uuid null,
    qty                 int null,
    cost                numeric null,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL,

    foreign key (project) references projects.projects(id),
    foreign key (item) references inventory.item(id)
);