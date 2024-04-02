DROP VIEW IF EXISTS asset.vehicle_usage_accumulated_report;
CREATE OR REPLACE VIEW asset.vehicle_usage_accumulated_report AS
select
	uuid_generate_v4() AS id,
    a.asset,
    DATE_TRUNC('day', CAST(a.start_datetime AS TIMESTAMP)) AS date_of_usage,
    SUM(CAST(a.end_odometer_reading AS INTEGER) - CAST(a.start_odometer_reading AS INTEGER)) OVER (PARTITION BY a.asset, DATE_TRUNC('day', CAST(a.start_datetime AS TIMESTAMP)) ORDER BY a.start_datetime) AS accumulated_odometer,
    SUM(CAST(a.end_fuel_reading  AS INTEGER) - CAST(a.start_fuel_reading  AS INTEGER)) OVER (PARTITION BY a.asset, DATE_TRUNC('day', CAST(a.start_datetime AS TIMESTAMP)) ORDER BY a.start_datetime) AS accumulated_fuel
FROM
    asset.vehicle_usage_monitoring a;