CREATE OR REPLACE VIEW accounting.all_payable
AS SELECT p.id,
          p.ap_no,
          p.supplier,
          s.supplier_fullname,
          s.supplier_types,
          st.supplier_type_description,
          p.ap_category,
              date(rr.received_ref_date) AS invoice_date,
              p.apv_date,
              p.due_date,
              p.invoice_no,
              p.remarks_notes,
              round(p.net_amount - p.applied_amount - p.da_amount - p.dm_amount, 2) AS balance,
              p.posted
   FROM accounting.payables p
              LEFT JOIN inventory.supplier s ON s.id = p.supplier
              LEFT JOIN inventory.supplier_types st ON st.id = s.supplier_types
              LEFT JOIN inventory.receiving_report rr ON rr.id = p.receiving;