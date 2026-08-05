CREATE OR REPLACE VIEW accounting.project_expense AS
SELECT
    pd.project       AS project_id,
    pr.description   AS project_description,
    pd.trans_type    AS trans_type,
    att.description  AS trans_type_description,
    SUM(COALESCE(pd.net_amount, 0)) AS total_net_amount,
    COUNT(*)         AS line_count,
    COUNT(DISTINCT pd.payables) AS payable_count
FROM accounting.payables_detials pd
         JOIN accounting.payables p
              ON p.id = pd.payables
         JOIN projects.projects pr
              ON pr.id = pd.project
         LEFT JOIN accounting.ap_trans_types att
                   ON att.id = pd.trans_type          -- or: att.code = pd.trans_type (use whichever matches your schema)
WHERE p.posted IS TRUE
GROUP BY
    pd.project,
    pr.description,
    pd.trans_type,
    att.description;