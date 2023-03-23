CREATE TABLE projects.projects_updates_notes (
    id                  uuid not null primary key,
    date_transact       timestamp NULL DEFAULT now(),
    remarks             text null,
    user_id             uuid null,
    project_updates     uuid null,


    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL,

    foreign key (project_updates) references projects.project_updates(id),
    foreign key (user_id) references hrm.employees(id)
);

CREATE TABLE projects.projects_updates_materials (
    id                  uuid not null primary key,
    project_updates     uuid null,
    project             uuid null,
    date_transact       timestamp NULL DEFAULT now(),
    item                uuid null,
    qty                 int default 0,
    cost                numeric default 0,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL,

    foreign key (project_updates) references projects.project_updates(id),
    foreign key (project) references projects.projects(id),
    foreign key (item) references inventory.item(id)
);

DROP TABLE if exists projects.project_materials;