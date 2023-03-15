-- cashier.payments definition

-- Drop table

-- DROP TABLE cashier.payments;
CREATE SCHEMA cashier;
CREATE TABLE cashier.payments (
	id uuid NOT NULL,
	totalpayments numeric NULL,
	totalcash numeric NULL,
	totalcheck numeric NULL,
	totalcard numeric NULL,
	ornumber varchar NULL,
	description varchar NULL,
	billingid uuid NULL,
	billingitemid uuid NULL,
	shiftid uuid NULL,
	receipt_type varchar NULL,
	"void" bool NULL,
	void_date timestamp NULL DEFAULT now(),
	void_type varchar NULL,
	deleted bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	remarks varchar NULL,
	in_words varchar NULL,
	CONSTRAINT payments_pkey PRIMARY KEY (id)
);


-- cashier.payments_details definition

-- Drop table

-- DROP TABLE cashier.payments_details;

CREATE TABLE cashier.payments_details (
	id uuid NOT NULL,
	amount numeric NULL,
	"type" varchar NULL,
	reference varchar NULL,
	check_date varchar NULL DEFAULT now(),
	expiry varchar NULL,
	bank varchar NULL,
	name_of_card varchar NULL,
	card_type varchar NULL,
	approval_code varchar NULL,
	pos_terminal_id varchar NULL,
	paymentid uuid NULL,
	voided bool NULL,
	deleted bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	CONSTRAINT payments_details_pkey PRIMARY KEY (id)
);


-- cashier.payments_target_item definition

-- Drop table

-- DROP TABLE cashier.payments_target_item;

CREATE TABLE cashier.payments_target_item (
	id uuid NOT NULL,
	paymentid uuid NULL,
	billingid uuid NULL,
	billingitemid uuid NULL,
	amount numeric NULL,
	voided bool NULL,
	deleted bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	CONSTRAINT payments_target_item_pkey PRIMARY KEY (id)
);


-- cashier.shifting definition

-- Drop table

-- DROP TABLE cashier.shifting;

CREATE TABLE cashier.shifting (
	id uuid NOT NULL,
	terminal uuid NULL,
	shift_no varchar NULL,
	active bool NULL,
	start_shift timestamp NULL DEFAULT now(),
	end_shift timestamp NULL DEFAULT now(),
	employee uuid NULL,
	deleted bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	remarks varchar(500) NULL DEFAULT NULL::character varying,
	CONSTRAINT shifting_pkey PRIMARY KEY (id)
);


-- cashier.terminals definition

-- Drop table

-- DROP TABLE cashier.terminals;

CREATE TABLE cashier.terminals (
	id uuid NOT NULL,
	terminal_no varchar NULL,
	description varchar NULL,
	mac_address varchar NULL,
	employee uuid NULL,
	deleted bool NULL,
	created_by varchar(50) NULL,
	created_date timestamp NULL DEFAULT now(),
	last_modified_by varchar(50) NULL,
	last_modified_date timestamp NULL DEFAULT now(),
	CONSTRAINT terminals_pkey PRIMARY KEY (id)
);


-- cashier.payments foreign keys

ALTER TABLE cashier.payments ADD CONSTRAINT payments_billingid_fkey FOREIGN KEY (billingid) REFERENCES billing.billing(id);
ALTER TABLE cashier.payments ADD CONSTRAINT payments_billingitemid_fkey FOREIGN KEY (billingitemid) REFERENCES billing.billing_item(id);
ALTER TABLE cashier.payments ADD CONSTRAINT payments_shiftid_fkey FOREIGN KEY (shiftid) REFERENCES cashier.shifting(id);


-- cashier.payments_details foreign keys

ALTER TABLE cashier.payments_details ADD CONSTRAINT payments_details_paymentid_fkey FOREIGN KEY (paymentid) REFERENCES cashier.payments(id);


-- cashier.payments_target_item foreign keys

ALTER TABLE cashier.payments_target_item ADD CONSTRAINT payments_target_item_billingid_fkey FOREIGN KEY (billingid) REFERENCES billing.billing(id);
ALTER TABLE cashier.payments_target_item ADD CONSTRAINT payments_target_item_billingitemid_fkey FOREIGN KEY (billingitemid) REFERENCES billing.billing_item(id);
ALTER TABLE cashier.payments_target_item ADD CONSTRAINT payments_target_item_paymentid_fkey FOREIGN KEY (paymentid) REFERENCES cashier.payments(id);


-- cashier.shifting foreign keys

ALTER TABLE cashier.shifting ADD CONSTRAINT shifting_employee_fkey FOREIGN KEY (employee) REFERENCES hrm.employees(id);
ALTER TABLE cashier.shifting ADD CONSTRAINT shifting_terminal_fkey FOREIGN KEY (terminal) REFERENCES cashier.terminals(id);


-- cashier.terminals foreign keys

ALTER TABLE cashier.terminals ADD CONSTRAINT terminals_employee_fkey FOREIGN KEY (employee) REFERENCES hrm.employees(id);


-- cashier.payment_items source

CREATE OR REPLACE VIEW cashier.payment_items
AS SELECT pti.id,
    pti.paymentid,
    pti.billingid,
    pti.billingitemid,
    pti.created_date AS payment_date,
    bi.trans_date,
    bi.description,
    bi.item_type,
    pti.amount,
        CASE
            WHEN bi.item_type::text = 'ITEM'::text THEN round(pti.amount * 0.12, 2)
            ELSE 0::numeric
        END AS output_tax
   FROM cashier.payments_target_item pti,
    billing.billing_item bi
  WHERE pti.billingitemid = bi.id;