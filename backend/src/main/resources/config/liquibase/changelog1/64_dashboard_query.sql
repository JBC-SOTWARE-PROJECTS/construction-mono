CREATE OR REPLACE FUNCTION billing.get_chart_per_month_revenue(curr_date date)
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
            and bi.status = true and bi.item_type in ('PAYMENTS')
        );
		RETURN value;
END; $function$
;


CREATE OR REPLACE FUNCTION billing.get_chart_per_month_expense(curr_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE value numeric;
BEGIN
		value = (
           	select
            coalesce(round(sum(bi.amount),2),0) as gross
            from cashier.petty_cash bi
            where EXTRACT(YEAR FROM bi.date_trans) = EXTRACT(YEAR from curr_date)
            and EXTRACT(month FROM bi.date_trans) = EXTRACT(MONTH from curr_date)
            and bi.is_posted = true
        );
		RETURN value;
END; $function$
;


CREATE OR REPLACE FUNCTION billing.sales_charts_revenue(data_dates date)
 RETURNS TABLE(jan numeric, feb numeric, mar numeric, apr numeric, may numeric, jun numeric, jul numeric, aug numeric, sep numeric, oct numeric, nov numeric, dece numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  select
	billing.get_chart_per_month_revenue(data_dates) as jan,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '1 month' as date)) as feb,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '2 month'as date)) as mar,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '3 month'as date)) as apr,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '4 month'as date)) as may,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '5 month'as date)) as jun,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '6 month'as date)) as jul,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '7 month'as date)) as aug,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '8 month'as date)) as sep,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '9 month'as date)) as oct,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '10 month'as date)) as nov,
	billing.get_chart_per_month_revenue(cast(data_dates+ interval '11 month'as date)) as dece;
end;
$function$
;

CREATE OR REPLACE FUNCTION billing.sales_charts_expense(data_dates date)
 RETURNS TABLE(jan numeric, feb numeric, mar numeric, apr numeric, may numeric, jun numeric, jul numeric, aug numeric, sep numeric, oct numeric, nov numeric, dece numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  select
	billing.get_chart_per_month_expense(data_dates) as jan,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '1 month' as date)) as feb,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '2 month'as date)) as mar,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '3 month'as date)) as apr,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '4 month'as date)) as may,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '5 month'as date)) as jun,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '6 month'as date)) as jul,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '7 month'as date)) as aug,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '8 month'as date)) as sep,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '9 month'as date)) as oct,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '10 month'as date)) as nov,
	billing.get_chart_per_month_expense(cast(data_dates+ interval '11 month'as date)) as dece;
end;
$function$
;


CREATE OR REPLACE FUNCTION billing.get_chart_per_month_profit(curr_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE payments numeric;
DECLARE expense numeric;
BEGIN
		payments = (
           	select
            coalesce(round(sum(bi.credit),2),0) as gross
            from billing.billing_item bi
            where EXTRACT(YEAR FROM bi.trans_date) = EXTRACT(YEAR from curr_date)
            and EXTRACT(month FROM bi.trans_date) = EXTRACT(MONTH from curr_date)
            and bi.status = true and bi.item_type in ('PAYMENTS')
        );
       expense = (
           	select
            coalesce(round(sum(bi.amount),2),0) as gross
            from cashier.petty_cash bi
            where EXTRACT(YEAR FROM bi.date_trans) = EXTRACT(YEAR from curr_date)
            and EXTRACT(month FROM bi.date_trans) = EXTRACT(MONTH from curr_date)
            and bi.is_posted = true
        );
		RETURN payments - expense;
END; $function$
;

CREATE OR REPLACE FUNCTION billing.sales_charts_profit(data_dates date)
 RETURNS TABLE(jan numeric, feb numeric, mar numeric, apr numeric, may numeric, jun numeric, jul numeric, aug numeric, sep numeric, oct numeric, nov numeric, dece numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  select
	billing.get_chart_per_month_profit(data_dates) as jan,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '1 month' as date)) as feb,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '2 month'as date)) as mar,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '3 month'as date)) as apr,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '4 month'as date)) as may,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '5 month'as date)) as jun,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '6 month'as date)) as jul,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '7 month'as date)) as aug,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '8 month'as date)) as sep,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '9 month'as date)) as oct,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '10 month'as date)) as nov,
	billing.get_chart_per_month_profit(cast(data_dates+ interval '11 month'as date)) as dece;
end;
$function$