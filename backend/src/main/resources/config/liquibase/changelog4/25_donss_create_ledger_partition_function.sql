CREATE OR REPLACE FUNCTION public.create_ledger_monthly_partitions(start_d date, end_d date)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    schema_name TEXT := 'accounting';
    table_name TEXT := 'ledger';
    partition_name TEXT := 'transaction_date_only';
    start_date DATE := start_d;
    end_date DATE := end_d;
    partition_exists BOOLEAN;
    current_date_no DATE;
    month_num INT;
BEGIN
    -- Loop through each month in the date range
    FOR current_date_no IN SELECT generate_series(start_date, end_date, '1 month')::DATE LOOP
        -- Convert current_date to numeric representation
        month_num :=  EXTRACT(MONTH FROM current_date_no);
        RAISE NOTICE 'Current month: %', current_date_no;
       
        -- Generate partition name and dates for the month
        partition_name := table_name || '_' || EXTRACT(YEAR FROM current_date_no);
        partition_name := partition_name || '_' || LPAD(EXTRACT(MONTH FROM current_date_no)::TEXT, 2, '0');
        start_date := DATE_TRUNC('month', current_date_no);
        end_date := start_date + INTERVAL '1 month';
        
        -- Check if the partition already exists
        EXECUTE format('SELECT EXISTS(SELECT 1 FROM pg_tables WHERE schemaname = %L AND tablename = %L)',
                       schema_name, partition_name)
        INTO partition_exists;

        -- Create the partition dynamically if it doesn't exist
        IF NOT partition_exists THEN
            EXECUTE format('CREATE TABLE %I.%I PARTITION OF %I.%I FOR VALUES FROM (%L) TO (%L)',
                           schema_name, partition_name, schema_name, table_name, start_date, end_date);
        END IF;
    END LOOP;
    
    -- Return control to the caller
    RETURN;
END;
$function$
;

SELECT FROM create_ledger_monthly_partitions('2023-01-01','2024-12-01');
