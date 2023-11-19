CREATE OR REPLACE FUNCTION GetWeeklyDatesService(dayText TEXT)
RETURNS DATE as $$
BEGIN
    return (CURRENT_DATE + (
		    CASE dayText
		        WHEN 'MONDAY' THEN
		            CASE WHEN EXTRACT(DOW FROM CURRENT_DATE)::INTEGER > 1 THEN
		                8 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            ELSE
		                1 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            END
		        WHEN 'TUESDAY' THEN
		            CASE WHEN EXTRACT(DOW FROM CURRENT_DATE)::INTEGER > 2 THEN
		                9 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            ELSE
		                2 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            END
		        WHEN 'WEDNESDAY' THEN
		            CASE WHEN EXTRACT(DOW FROM CURRENT_DATE)::INTEGER > 3 THEN
		                10 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            ELSE
		                3 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            END
		        WHEN 'THURSDAY' THEN
		            CASE WHEN EXTRACT(DOW FROM CURRENT_DATE)::INTEGER > 4 THEN
		                11 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            ELSE
		                4 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            END
		        WHEN 'FRIDAY' THEN
		            CASE WHEN EXTRACT(DOW FROM CURRENT_DATE)::INTEGER > 5 THEN
		                12 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            ELSE
		                5 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            END
		        WHEN 'SATURDAY' THEN
		            CASE WHEN EXTRACT(DOW FROM CURRENT_DATE)::INTEGER > 6 THEN
		                13 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            ELSE
		                6 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            END
		        WHEN 'SUNDAY' THEN
		            CASE WHEN EXTRACT(DOW FROM CURRENT_DATE)::INTEGER > 7 THEN
		                14 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            ELSE
		                7 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER
		            END
		        ELSE 1
		    END
		));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE VIEW asset.asset_upcoming_preventive_maintenance AS
SELECT *,
 (CASE
        WHEN schedule_type = 'DAILY' THEN
            (CURRENT_DATE + (occurrence::time - '00:00:00'::time))
        WHEN schedule_type = 'WEEKLY' then
        	GetWeeklyDates(occurrence)
		WHEN schedule_type = 'MONTHLY' then
			(DATE_TRUNC('month', CURRENT_DATE) + (occurrence::integer - EXTRACT(DAY FROM DATE_TRUNC('month', CURRENT_DATE))) * INTERVAL '1 DAY')::DATE
        WHEN schedule_type = 'YEARLY' then
			occurrence::DATE
		ELSE
            null
    end) as occurrence_date,
    (CASE
        WHEN schedule_type = 'DAILY' THEN
            CURRENT_DATE + (occurrence ::time) - INTERVAL '1 hour' * CAST(reminder_schedule AS INTEGER)
        WHEN schedule_type = 'WEEKLY' then
        	GetWeeklyDates(occurrence) - CAST(reminder_schedule AS INTEGER)
		WHEN schedule_type = 'MONTHLY' then
			(DATE_TRUNC('month', CURRENT_DATE) + (occurrence::integer - EXTRACT(DAY FROM DATE_TRUNC('month', CURRENT_DATE))) * INTERVAL '1 DAY')::DATE - CAST(reminder_schedule AS INTEGER)
		WHEN schedule_type = 'YEARLY' then
			(occurrence::DATE - CAST(reminder_schedule AS INTEGER))
		ELSE
            null
    end ) as reminder_date
FROM asset.asset_preventive_maintenance
WHERE
    CASE
        WHEN schedule_type = 'DAILY' THEN
            CURRENT_TIMESTAMP BETWEEN
            CURRENT_DATE + (occurrence ::time) - INTERVAL '1 hour' * CAST(reminder_schedule AS INTEGER)
            AND (CURRENT_DATE + (occurrence::time - '00:00:00'::time))
        WHEN schedule_type = 'WEEKLY' then
        	CURRENT_DATE BETWEEN
        	GetWeeklyDates(occurrence) - CAST(reminder_schedule AS INTEGER) AND
		    GetWeeklyDates(occurrence)
		WHEN schedule_type = 'MONTHLY' then
			CURRENT_DATE BETWEEN
			(DATE_TRUNC('month', CURRENT_DATE) + (occurrence::integer - EXTRACT(DAY FROM DATE_TRUNC('month', CURRENT_DATE))) * INTERVAL '1 DAY')::DATE - CAST(reminder_schedule AS INTEGER) and
			(DATE_TRUNC('month', CURRENT_DATE) + (occurrence::integer - EXTRACT(DAY FROM DATE_TRUNC('month', CURRENT_DATE))) * INTERVAL '1 DAY')::DATE
        WHEN schedule_type = 'YEARLY' then
			CURRENT_DATE between
			(occurrence::DATE - CAST(reminder_schedule AS INTEGER)) AND
            occurrence::DATE
		ELSE
            FALSE
    END
