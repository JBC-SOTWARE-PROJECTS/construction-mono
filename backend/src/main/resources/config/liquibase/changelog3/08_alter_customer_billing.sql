DROP FUNCTION IF EXISTS billing.customer_billing;

CREATE OR REPLACE FUNCTION billing.customer_billing(bill_id uuid)
 RETURNS TABLE(id uuid, billing uuid, item uuid, item_type character varying, trans_date timestamp without time zone, description character varying, qty numeric, price numeric, amount_charge numeric, deduction numeric, net numeric, credit numeric, balance numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  select
  bi.id, bi.billing, bi.item, bi.item_type ,bi.trans_date, bi.description, bi.qty, bi.debit as price,
  bi.sub_total as amount_charge,
  (select billing.deduction(bi.id)) as deduction,
  (select billing.net_amount(bi.id)) as net,
  (select billing.credited_payment(bi.id)) as credit,
  (select billing.balance(bi.id)) as balance
  from billing.billing_item bi where bi.billing = bill_id and bi.item_type in ('ITEM', 'SERVICE')
  and bi.status = true;
END;
$function$
;
