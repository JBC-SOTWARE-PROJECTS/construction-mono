
DROP TABLE IF EXISTS cashier.petty_type;
CREATE TABLE cashier.petty_type (
	id uuid PRIMARY KEY NOT NULL,
	code varchar NULL,
	description varchar NULL,
	is_active bool NULL,

	deleted_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL
);

DROP TABLE IF EXISTS cashier.petty_cash;
CREATE TABLE cashier.petty_cash (
	id uuid PRIMARY KEY NOT NULL,
	code varchar NULL,
	petty_type uuid null,
	remarks varchar NULL,
	amount numeric default 0,
	received_by uuid null,
	is_posted bool NULL,
	is_void bool NULL,

	deleted_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	deleted bool NULL
);

