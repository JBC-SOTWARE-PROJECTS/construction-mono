-- billing.billing_item_view source

CREATE OR REPLACE VIEW billing.billing_item_view
AS SELECT bi.id,
    bi.trans_date,
    bi.billing,
    bi.record_no,
    upper(bi.description::text) AS description,
    bi.item,
    bi.qty,
    round(bi.debit, 2) AS debit,
    round(bi.credit, 2) AS credit,
    round(bi.sub_total, 2) AS sub_total,
    bi.item_type,
    bi.trans_type,
    bi.credit_payment,
    bi.or_num,
    bi.status,
    bi.deleted,
    bi.created_by,
    bi.created_date,
    bi.last_modified_by,
    bi.last_modified_date
   FROM billing.billing_item bi
  WHERE bi.status = true;