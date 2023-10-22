-- accounting.release_checks definition

-- Drop table

-- DROP TABLE accounting.release_checks;

CREATE TABLE accounting.release_checks
(
    id                 uuid NOT NULL,
    release_date       date NULL,
    disbursement       uuid NULL,
    bank               uuid NULL,
    checks             uuid NULL,
    company            uuid NULL,
    is_posted          bool NULL,
    release_by         varchar NULL,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,

    CONSTRAINT release_checks_pkey PRIMARY KEY (id)
);


-- accounting.release_checks foreign keys

ALTER TABLE accounting.release_checks
    ADD CONSTRAINT release_checks_checks_fkey FOREIGN KEY (checks) REFERENCES accounting.disbursement_check (id);

ALTER TABLE accounting.release_checks
    ADD CONSTRAINT release_checks_company_fkey FOREIGN KEY (company) REFERENCES accounting.disbursement_check (id);

CREATE INDEX idx_release_checks_company ON accounting.release_checks USING btree (company);