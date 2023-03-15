CREATE OR REPLACE FUNCTION billing.get_chart_per_month_deduction(curr_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select
            coalesce(round(sum(bi.credit),2),0) as gross
            from billing.billing_item bi
            where EXTRACT(YEAR FROM bi.trans_date) = EXTRACT(YEAR from curr_date)
            and EXTRACT(month FROM bi.trans_date) = EXTRACT(MONTH from curr_date)
            and bi.status = true and bi.item_type in ('DEDUCTIONS')
        );
		RETURN value;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.get_chart_per_month_net(curr_date date)
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
            and bi.status = true and bi.item_type in ('ITEM', 'SERVICE', 'MISC', 'DEDUCTIONS')
        );
		RETURN value;
END; $function$
;



CREATE OR REPLACE FUNCTION billing.sales_charts_deduct(data_dates date)
 RETURNS TABLE(jan numeric, feb numeric, mar numeric, apr numeric, may numeric, jun numeric, jul numeric, aug numeric, sep numeric, oct numeric, nov numeric, dece numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  select
	billing.get_chart_per_month_deduction(data_dates) as jan,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '1 month' as date)) as feb,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '2 month'as date)) as mar,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '3 month'as date)) as apr,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '4 month'as date)) as may,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '5 month'as date)) as jun,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '6 month'as date)) as jul,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '7 month'as date)) as aug,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '8 month'as date)) as sep,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '9 month'as date)) as oct,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '10 month'as date)) as nov,
	billing.get_chart_per_month_deduction(cast(data_dates+ interval '11 month'as date)) as dece;
end;
$function$
;

CREATE OR REPLACE FUNCTION billing.sales_charts_net(data_dates date)
 RETURNS TABLE(jan numeric, feb numeric, mar numeric, apr numeric, may numeric, jun numeric, jul numeric, aug numeric, sep numeric, oct numeric, nov numeric, dece numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  select
	billing.get_chart_per_month_net(data_dates) as jan,
	billing.get_chart_per_month_net(cast(data_dates+ interval '1 month' as date)) as feb,
	billing.get_chart_per_month_net(cast(data_dates+ interval '2 month'as date)) as mar,
	billing.get_chart_per_month_net(cast(data_dates+ interval '3 month'as date)) as apr,
	billing.get_chart_per_month_net(cast(data_dates+ interval '4 month'as date)) as may,
	billing.get_chart_per_month_net(cast(data_dates+ interval '5 month'as date)) as jun,
	billing.get_chart_per_month_net(cast(data_dates+ interval '6 month'as date)) as jul,
	billing.get_chart_per_month_net(cast(data_dates+ interval '7 month'as date)) as aug,
	billing.get_chart_per_month_net(cast(data_dates+ interval '8 month'as date)) as sep,
	billing.get_chart_per_month_net(cast(data_dates+ interval '9 month'as date)) as oct,
	billing.get_chart_per_month_net(cast(data_dates+ interval '10 month'as date)) as nov,
	billing.get_chart_per_month_net(cast(data_dates+ interval '11 month'as date)) as dece;
end;
$function$
;