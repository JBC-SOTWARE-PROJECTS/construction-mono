DROP VIEW IF EXISTS asset.vehicle_usage_accumulated_report;
CREATE OR REPLACE VIEW asset.vehicle_usage_accumulated_report AS
SELECT
        uuid_generate_v4() AS id,
        a.asset,
        DATE_TRUNC('day', a.start_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') AS date_of_usage,
        SUM(CAST(a.end_odometer_reading AS DECIMAL) - CAST(a.start_odometer_reading AS DECIMAL)) AS accumulated_odometer,
        SUM(CAST(a.end_fuel_reading  AS DECIMAL) - CAST(a.start_fuel_reading  AS DECIMAL)) AS accumulated_fuel
    FROM
        asset.vehicle_usage_monitoring a
    GROUP BY
        a.asset,
        DATE_TRUNC('day', a.start_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila')
    ORDER by
    date_of_usage DESC