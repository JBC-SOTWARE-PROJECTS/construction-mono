CREATE OR REPLACE FUNCTION billing.get_soa(billing_id uuid, trans_date timestamp without time zone)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE value varchar;
BEGIN
		value = (
			select
			(select concat('BILL # :',(date_part('year', trans_date)),'-',b.bill_no)) as soa
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
			and bi.status = true and bi.item_type in ('ITEM', 'SERVICE', 'MISC')
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
            and bi.status = true and bi.item_type in ('ITEM', 'SERVICE', 'MISC')
        );
		RETURN value;
END; $function$
;

DROP FUNCTION IF EXISTS billing.sales_reports;
CREATE OR REPLACE FUNCTION billing.sales_reports(date_start date, date_end date, fil_search character varying)
 RETURNS TABLE(id uuid, trans_type character varying, trans_date timestamp without time zone, ornumber character varying, bill character varying, ref_no character varying, category character varying, description character varying, gross numeric, deductions character varying, disc_amount numeric, netsales numeric, date_trans text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  select
  	bi.id,
	bi.trans_type,
	bi.trans_date,
	coalesce(bi.or_num, '') as or_num,
	(select billing.get_soa(bi.billing, bi.trans_date )) as bill,
	bi.record_no as ref_no,
	bi.item_type as category,
	case
		when bi.item_type = 'ITEM' or bi.item_type = 'SERVICE' or bi.item_type = 'MISC'
		then bi.description
		else ''
	end as description,
	case
		when bi.item_type = 'ITEM' or bi.item_type = 'SERVICE' or bi.item_type = 'MISC'
		then round(bi.sub_total, 2)
		else 0
	end as gross,
	case
		when bi.item_type = 'DEDUCTIONS'
		then bi.description
		else ''
	end as deductions,
	case
		when bi.item_type = 'DEDUCTIONS'
		then round(bi.sub_total, 2)
		else 0
	end as disc_amount,
	round(bi.sub_total, 2) as net_sales,
	to_char(bi.trans_date, 'MM/DD/YYYY') as date_trans
	from billing.billing_item bi
	where date(bi.trans_date) between date_start and date_end
	and lower(bi.description) like lower(concat('%',fil_search,'%'))
	and status = true and bi.item_type not in ('PAYMENTS') order by bi.trans_date asc;
END;
$function$
;

