

CREATE TABLE accounting.loans (
        id uuid NOT NULL,
        loan_no varchar(50) NULL,
        reference_no varchar(50) NULL,
        start_date date NULL,
        bank_account uuid NULL,
        compound_type varchar(50) NULL,
        interest_rate numeric NULL,
        loan_period int4 NULL,
        number_of_payments int4 NULL,
        loan_amount numeric NULL,
        loan_payment numeric NULL,
        total_interest numeric NULL,
        total_cost_of_loan numeric NULL,
        posted_ledger uuid NULL,

        company_id uuid NULL,
        created_by varchar(50) NULL,
        created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
        last_modified_by varchar(50) NULL,
        last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
        deleted bool NULL,
        CONSTRAINT loans_pkey PRIMARY KEY (id)
);

CREATE TABLE accounting.loan_amortization (
        id uuid NOT NULL,
                loan uuid NULL,
                order_no int4 NULL,
                record_no varchar(50) NULL,
        reference_no varchar(50) NULL,
        payment_date date NULL,
        beginning_balance numeric NULL,
        payment numeric NULL,
        principal numeric NULL,
        interest numeric NULL,
        ending_balance numeric NULL,
        posted_ledger uuid NULL,

        company_id uuid NULL,
        created_by varchar(50) NULL,
        created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
        last_modified_by varchar(50) NULL,
        last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
        deleted bool NULL,
        CONSTRAINT loan_amortization_pkey PRIMARY KEY (id)
);

