DROP TABLE IF EXISTS services.service_items;
DROP TABLE IF EXISTS services.service;
DROP SCHEMA IF EXISTS services;
CREATE SCHEMA services;
CREATE TABLE services.service (
    id                  uuid primary key not null,
    code                varchar null,
    description         varchar null,
    office              uuid null,
    type                varchar null,
    available           bool,
    cost                numeric,
    gov_cost            numeric,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

    foreign key(office) references public.office(id)
);

CREATE TABLE services.service_items (
    id                  uuid primary key not null,
    service             uuid null,
    item                uuid null,
    qty                 int default 0,
    wcost               numeric,

    created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL,

    foreign key(service) references services.service(id),
    foreign key(item) references inventory.item(id)
)
