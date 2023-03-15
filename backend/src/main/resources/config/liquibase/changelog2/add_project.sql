CREATE SCHEMA IF NOT EXISTS projects;

CREATE TABLE projects.projects (
    id                  uuid not null primary key,
    code                varchar,
    description         varchar,
    customer            uuid null,
    started             timestamp NULL DEFAULT now(),
    ended               timestamp NULL DEFAULT now(),
    location            uuid null,
    image               text null,
    total_cost          numeric null,
    status              varchar null,
    remarks             text null,

    created_by          varchar(50) NULL,
	created_date        timestamp NULL DEFAULT now(),
	last_modified_by    varchar(50) NULL,
	last_modified_date  timestamp NULL DEFAULT now(),
	deleted bool NULL,

    foreign key (customer) references billing.customer(id),
    foreign key (location) references public.office(id)
);