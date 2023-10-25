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
              LEFT JOIN inventory.receiving_report rr ON rr.id = p.receiving
   where p.status != 'VOIDED';

CREATE OR REPLACE FUNCTION accounting.aging_report(date_filter date, company uuid)
 RETURNS SETOF accounting.aging
 LANGUAGE plpgsql
AS $function$
DECLARE
item accounting.aging%rowtype;
    bi record ;
    current_amount numeric;
	day_1_to_31 numeric;
	day_31_to_60 numeric;
	day_61_to_90 numeric;
	day_91_to_120 numeric;
	older numeric;
	total numeric;
	num integer;
begin

    current_amount := 0;day_1_to_31 := 0;day_31_to_60 := 0;day_61_to_90 := 0;
    day_91_to_120 := 0;older := 0;total := 0;num := 0;

FOR bi in
    	--
select * from accounting.all_payable ap
where ap.balance > 0 and ap.due_date <= date_filter and ap.company = company
  --
    loop
		num = (date_filter - bi.due_date);
IF (num <= 0)  then
        	current_amount = bi.balance;
			day_1_to_31 := 0;
			day_31_to_60 := 0;
			day_61_to_90 := 0;
			day_91_to_120 := 0;
			older := 0;
		elsif (num between 1 and 30) then
        	current_amount := 0;
			day_1_to_31 = bi.balance;
			day_31_to_60 := 0;
			day_61_to_90 := 0;
			day_91_to_120 := 0;
			older := 0;
        elsif (num between 31 and 60) then
        	current_amount := 0;
			day_1_to_31 := 0;
			day_31_to_60 = bi.balance;
			day_61_to_90 := 0;
			day_91_to_120 := 0;
			older := 0;
        elsif (num between 61 and 90) then
        	current_amount := 0;
			day_1_to_31 := 0;
			day_31_to_60 := 0;
			day_61_to_90 = bi.balance;
			day_91_to_120 := 0;
			older := 0;
        elsif (num between 91 and 120) then
        	current_amount := 0;
			day_1_to_31 := 0;
			day_31_to_60 := 0;
			day_61_to_90 := 0;
			day_91_to_120 = bi.balance;
			older := 0;
else
        	current_amount := 0;
			day_1_to_31 := 0;
			day_31_to_60 := 0;
			day_61_to_90 := 0;
			day_91_to_120 := 0;
			older = bi.balance;
end if;

        item.id = bi.id;
        item.supplier_id = bi.supplier;
       	item.supplier_type_id = bi.supplier_types;
		item.ap_no = bi.ap_no;
		item.supplier = bi.supplier_fullname;
		item.supplier_type = bi.supplier_type_description;
		item.ap_category = bi.ap_category ;
		item.invoice_date = bi.invoice_date;
		item.apv_date = bi.apv_date;
		item.due_date = bi.due_date;
		item.invoice_no = bi.invoice_no;
		item.remarks_notes = bi.remarks_notes;
		item.posted = bi.posted;
		item.current_amount = current_amount;
		item.day_1_to_31 = day_1_to_31;
		item.day_31_to_60 = day_31_to_60;
		item.day_61_to_90 = day_61_to_90;
		item.day_91_to_120 = day_91_to_120;
		item.older = older;
		item.total = current_amount + day_1_to_31 + day_31_to_60 + day_61_to_90 + day_91_to_120 + older;
	    return next item;
END LOOP;
end
$function$
;

CREATE OR REPLACE FUNCTION accounting.ap_ledger(sup uuid, company uuid)
 RETURNS TABLE(id uuid, supplier uuid, supplier_fullname character varying, ledger_type character varying, ledger_date timestamp without time zone, ref_no character varying, ref_id uuid, debit numeric, credit numeric, running_balance numeric, out_balance numeric, is_include boolean, beg_balance numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
    with ledger as (select
  al.id,
  al.supplier,
  s.supplier_fullname,
  al.ledger_type,
  al.ledger_date,
  al.ref_no,
  al.ref_id,
  round(al.debit,2) as debit,
  round(al.credit,2) as credit,
  round(sum(al.credit - al.debit) over
  (order by al.ledger_date),2) as running_balance,
  case
  	WHEN (al.ledger_type = 'AP' or al.ledger_type = 'PF' or al.ledger_type = 'RF')
		THEN accounting.balance_ap(al.ref_id)
		ELSE  accounting.balance_dis(al.ref_id)
  END as out_balance,
  al.is_include
  from accounting.ap_ledger al, inventory.supplier s where
  al.supplier = sup
  and s.id = al.supplier
  and al.company = company
  and al.is_include = true and (al.deleted is null or al.deleted = false))
select l.*, coalesce(lag(l.running_balance, 1) over (order by l.ledger_date),l.running_balance) as beg_balance from ledger l;
END;
$function$
;