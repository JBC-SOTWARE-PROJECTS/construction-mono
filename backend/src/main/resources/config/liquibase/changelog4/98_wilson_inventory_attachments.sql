DROP TABLE IF EXISTS inventory.attachments;

CREATE TABLE inventory.attachments
(
    id                 uuid NOT NULL,
    reference_id       uuid NULL,
    date_transact      timestamp NULL DEFAULT now(),
    folder_name        varchar NULL,
    file_name          varchar NULL,
    mimetype           varchar NULL,
    created_by         varchar(50) NULL,
    created_date       timestamp NULL DEFAULT now(),
    last_modified_by   varchar(50) NULL,
    last_modified_date timestamp NULL DEFAULT now(),
    deleted            bool NULL,
    CONSTRAINT attachments_pkey PRIMARY KEY (id)
);
CREATE INDEX attachments_inventory_idx ON inventory.attachments USING btree (reference_id);