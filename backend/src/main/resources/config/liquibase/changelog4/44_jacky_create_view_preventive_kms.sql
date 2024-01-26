CREATE OR REPLACE VIEW asset.asset_preventive_kms AS
WITH latest_apm AS (
 SELECT
    *,
	   (
	    SELECT
	      vum.end_odometer_reading
	    FROM
	      asset.vehicle_usage_monitoring vum
	    WHERE
	      vum.asset = apm.asset
	    ORDER BY
	      vum.created_date DESC
	    LIMIT 1
	  )::numeric AS latest_usage
  FROM asset.asset_preventive_maintenance apm
  where apm.schedule_type = 'KILOMETERS'
),
 adjusted AS (
  SELECT
    *,
    CASE WHEN MOD(lapm.latest_usage::numeric  , lapm.occurrence::numeric) > 0 THEN TRUNC(lapm.latest_usage  / lapm.occurrence::numeric) + 1 ELSE (lapm.latest_usage::numeric  / lapm.occurrence::numeric) END AS adjusted_raw
  FROM latest_apm lapm
),
nearest AS (
 SELECT
    *,
    ad.start_basis::numeric + (ad.occurrence::numeric * ad.adjusted_raw) AS next_nearest
  FROM adjusted ad
)
SELECT
  *
FROM nearest nr
  where nr.latest_usage >= (nr.next_nearest - nr.reminder_schedule::numeric ) AND  nr.latest_usage <= (nr.next_nearest + nr.reminder_schedule::numeric )
;