CREATE INDEX IF NOT EXISTS details_header_ledger_idx ON accounting.header_ledger_details (header_ledger);
CREATE INDEX IF NOT EXISTS details_header_ledger_all_field_idx ON accounting.header_ledger_details (header_ledger)
    include(field_name, field_value,id);