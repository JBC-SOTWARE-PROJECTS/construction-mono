
CREATE SCHEMA IF NOT EXISTS fixed_asset;

CREATE TABLE IF NOT EXISTS fixed_asset.fixed_asset_items (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
    serial_no VARCHAR,
    asset_no VARCHAR(50) NOT NULL,
    item_name VARCHAR,
    description TEXT,
    item_id uuid,
    office_id uuid,
    company_id uuid,
    reference VARCHAR,

    purchase_id uuid,
    purchase_no VARCHAR,
    purchase_price NUMERIC,
    purchase_date DATE,

    depreciation_method VARCHAR,
    depreciation_start_date DATE,
    salvage_value NUMERIC,
    useful_life INT,
    accumulated_depreciation NUMERIC,
    book_value NUMERIC,

    delivery_receiving_id uuid,
    delivery_receiving_item_id uuid,
    delivery_receiving_date uuid,

    status VARCHAR,

    created_by varchar(50) NULL,
    created_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50) NULL,
    last_modified_date timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP,
    deleted bool NULL,
    CONSTRAINT fixed_assets_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_fixed_asset_items_company_id ON accounting.ar_payment_posting (company_id);