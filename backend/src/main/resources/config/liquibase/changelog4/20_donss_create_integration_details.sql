
CREATE TABLE IF NOT EXISTS accounting.integration_items_details (
	id uuid NULL,
	field_name varchar NULL,
	field_value varchar NULL,
	integration_item uuid NULL
);
ALTER TABLE accounting.integration_items_details ADD CONSTRAINT fk_integration_details_1 FOREIGN KEY (integration_item) REFERENCES accounting.integration_items(id) ON DELETE CASCADE ON UPDATE CASCADE;