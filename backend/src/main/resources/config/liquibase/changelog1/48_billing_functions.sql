CREATE OR REPLACE FUNCTION billing.balance(billing_id uuid)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select coalesce(round((select billing.net_amount(billing_id)) - (select billing.credited_payment(billing_id)),2), 0)
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.credited_payment(billing_id uuid)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select coalesce(round(sum(pti.amount),2),0) from cashier.payments_target_item pti
			where pti.billingitemid = billing_id
			and (pti.voided is null or pti.voided = false)
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.customer_billing(bill_id uuid)
 RETURNS TABLE(id uuid, billing uuid, item uuid, item_type character varying, trans_date timestamp without time zone, description character varying, qty integer, price numeric, amount_charge numeric, deduction numeric, net numeric, credit numeric, balance numeric)
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

CREATE OR REPLACE FUNCTION billing.deduction(billing_id uuid)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
            select coalesce(round(sum(dd.discount_amount),2),0) from billing.discount_details dd
			where dd.ref_billing_item = billing_id
			and (deleted is null or deleted = false)
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.get_chart_per_month(curr_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select
            coalesce(round(sum(bi.sub_total),2),0) as gross
            from billing.billing_item bi
            where EXTRACT(YEAR FROM bi.trans_date) = EXTRACT(YEAR from curr_date)
            and EXTRACT(month FROM bi.trans_date) = EXTRACT(MONTH from curr_date)
            and bi.status = true and bi.item_type in ('ITEM', 'SERVICE')
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.get_soa(billing_id uuid, trans_date timestamp without time zone)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE value varchar;
BEGIN
		value = (
			select
			(select concat('SOA:',(date_part('year', trans_date)),'-',b.bill_no)) as soa
			from billing.billing b where b.id = billing_id
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.gross_sales(date_start date, date_end date, fil_search character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select
  			coalesce (round(sum(bi.sub_total),2),0) as gross
			from billing.billing_item bi
			where date(bi.trans_date) between date_start and date_end
			and lower(bi.description) like lower(concat('%',fil_search,'%'))
			and bi.status = true and bi.item_type in ('ITEM', 'SERVICE')
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.net_amount(billing_id uuid)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
            select coalesce(round(bi.sub_total - (select billing.deduction(bi.id)),2),0) from billing.billing_item bi
			where bi.id = billing_id
			and (deleted is null or deleted = false)
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.net_sales(date_start date, date_end date, fil_search character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select
  			coalesce (round(sum(bi.sub_total),2),0) as gross
			from billing.billing_item bi
			where date(bi.trans_date) between date_start and date_end
			and lower(bi.description) like lower(concat('%',fil_search,'%'))
			and bi.status = true and bi.item_type not in ('PAYMENTS')
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.sales_charts(data_dates date)
 RETURNS TABLE(jan numeric, feb numeric, mar numeric, apr numeric, may numeric, jun numeric, jul numeric, aug numeric, sep numeric, oct numeric, nov numeric, dece numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  select
	billing.get_chart_per_month(data_dates) as jan,
	billing.get_chart_per_month(cast(data_dates+ interval '1 month' as date)) as feb,
	billing.get_chart_per_month(cast(data_dates+ interval '2 month'as date)) as mar,
	billing.get_chart_per_month(cast(data_dates+ interval '3 month'as date)) as apr,
	billing.get_chart_per_month(cast(data_dates+ interval '4 month'as date)) as may,
	billing.get_chart_per_month(cast(data_dates+ interval '5 month'as date)) as jun,
	billing.get_chart_per_month(cast(data_dates+ interval '6 month'as date)) as jul,
	billing.get_chart_per_month(cast(data_dates+ interval '7 month'as date)) as aug,
	billing.get_chart_per_month(cast(data_dates+ interval '8 month'as date)) as sep,
	billing.get_chart_per_month(cast(data_dates+ interval '9 month'as date)) as oct,
	billing.get_chart_per_month(cast(data_dates+ interval '10 month'as date)) as nov,
	billing.get_chart_per_month(cast(data_dates+ interval '11 month'as date)) as dece;
end;
$function$
;

CREATE OR REPLACE FUNCTION billing.sales_reports(date_start date, date_end date, fil_search character varying)
 RETURNS TABLE(id uuid, trans_type character varying, trans_date timestamp without time zone, ornumber character varying, soa character varying, ref_no character varying, category character varying, description character varying, gross numeric, deductions character varying, disc_amount numeric, commission numeric, netsales numeric, date_trans text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  select
  	bi.id,
	bi.trans_type,
	bi.trans_date,
	coalesce(bi.or_num, '') as or_num,
	(select billing.get_soa(bi.billing, bi.trans_date )) as soa,
	bi.record_no as ref_no,
	bi.item_type as category,
	case
		when bi.item_type = 'ITEM' or bi.item_type = 'SERVICE'
		then bi.description
		else ''
	end as description,
	case
		when bi.item_type = 'ITEM' or bi.item_type = 'SERVICE'
		then round(bi.sub_total, 2)
		else 0
	end as gross,
	case
		when bi.item_type = 'COMMISSION' or bi.item_type = 'DEDUCTIONS'
		then bi.description
		else ''
	end as deductions,
	case
		when bi.item_type = 'DEDUCTIONS'
		then round(bi.sub_total, 2)
		else 0
	end as disc_amount,
	case
		when bi.item_type = 'COMMISSION'
		then round(bi.sub_total, 2)
		else 0
	end as commission,
	round(bi.sub_total, 2) as net_sales,
	to_char(bi.trans_date, 'MM/DD/YYYY') as date_trans
	from billing.billing_item bi
	where date(bi.trans_date) between date_start and date_end
	and lower(bi.description) like lower(concat('%',fil_search,'%'))
	and status = true and bi.item_type not in ('PAYMENTS') order by bi.trans_date asc;
END;
$function$
;

CREATE OR REPLACE FUNCTION billing.total_commission(date_start date, date_end date, fil_search character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select
  			coalesce (round(sum(bi.credit),2),0) as gross
			from billing.billing_item bi
			where date(bi.trans_date) between date_start and date_end
			and lower(bi.description) like lower(concat('%',fil_search,'%'))
			and bi.status = true and bi.item_type in ('COMMISSION')
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.total_deduction(date_start date, date_end date, fil_search character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select
  			coalesce (round(sum(bi.credit),2),0) as gross
			from billing.billing_item bi
			where date(bi.trans_date) between date_start and date_end
			and lower(bi.description) like lower(concat('%',fil_search,'%'))
			and bi.status = true and bi.item_type in ('DEDUCTIONS')
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.total_deduction_commision(date_start date, date_end date, fil_search character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select
  			coalesce (round(sum(bi.credit),2),0) as gross
			from billing.billing_item bi
			where date(bi.trans_date) between date_start and date_end
			and lower(bi.description) like lower(concat('%',fil_search,'%'))
			and bi.status = true and bi.item_type in ('DEDUCTIONS', 'COMMISSION')
        );
		RETURN value;
END; $function$
;
