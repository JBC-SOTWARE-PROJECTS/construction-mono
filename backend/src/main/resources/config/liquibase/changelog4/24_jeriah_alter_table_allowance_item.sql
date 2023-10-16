ALTER TABLE hrm.allowance
 DROP COLUMN id;

ALTER TABLE hrm.allowance
 ADD COLUMN  id  uuid PRIMARY KEY NOT NULL;

ALTER TABLE hrm.allowance_package
DROP COLUMN id;

ALTER TABLE hrm.allowance_package
 ADD COLUMN  id   uuid PRIMARY KEY NOT NULL;


CREATE TABLE hrm.allowance_item (
   id                  uuid PRIMARY KEY NOT NULL,
   allowance_type      uuid NOT NULL
                            CONSTRAINT fk_allowance_item_allowance_allowance_type
                            REFERENCES hrm.allowance(id)
                            ON UPDATE CASCADE ON DELETE RESTRICT,

   package             uuid NOT NULL
                            CONSTRAINT fk_allowance_item_package
                            REFERENCES hrm.allowance_package(id)
                            ON UPDATE CASCADE ON DELETE RESTRICT,

   created_by          varchar(50),
   created_date        timestamp DEFAULT CURRENT_TIMESTAMP,
   last_modified_by    varchar(50),
   last_modified_date  timestamp DEFAULT CURRENT_TIMESTAMP,
   deleted             boolean,
   company             uuid not null

);

