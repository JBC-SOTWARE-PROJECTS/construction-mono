-- accounting.transaction_type definition

-- Drop table

-- DROP TABLE accounting.transaction_type;
CREATE TABLE inventory.transaction_type (
	id uuid NOT NULL,
	description varchar NULL,
	tag varchar NULL,
	flag_value varchar NULL,
	is_active bool NULL DEFAULT true,

	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	deleted bool NULL,

	CONSTRAINT transaction_type_pkey PRIMARY KEY (id)
);

INSERT INTO inventory.transaction_type (id, description, tag, flag_value, is_active, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('5e605dbe-72c3-45de-9c67-bd1141953fb2', 'DELIVERY RECEIVING', 'RECEIVING', 'DELIVERY_RECEIVING', true, 'system', '2020-06-13 07:15:44.644', 'system', '2020-12-30 00:22:53.738', NULL);
INSERT INTO inventory.transaction_type (id, description, tag, flag_value, is_active, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('ae83d3e9-44ab-4956-bbe5-415d45025953', 'DONATION RECEIVING', 'RECEIVING', 'DONATION_RECEIVING', true, 'system', '2020-06-13 07:15:56.709', 'system', '2021-01-13 06:57:43.030', NULL);
INSERT INTO inventory.transaction_type (id, description, tag, flag_value, is_active, created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('b8ddee54-9ffe-4328-8419-8074d9d6909b', 'EMERGENCY PURCHASE', 'RECEIVING', 'EMERGENCY_PURCHASE', true, 'system', '2020-07-17 02:11:10.550', 'system', '2021-08-04 01:11:44.740', NULL);
