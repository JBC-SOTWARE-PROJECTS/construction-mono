DROP VIEW IF EXISTS accounting.project_expense;

CREATE VIEW accounting.project_expense AS
SELECT
    pd.project                      AS project_id,
    pr.description                  AS project_description,
    pd.trans_type                   AS trans_type,
    'PAYABLE'                       AS source_type,
    'PAYABLE'                       AS source_category,
    att.description                 AS trans_type_description,
    SUM(COALESCE(pd.net_amount, 0)) AS total_net_amount,
    COUNT(*)                        AS line_count,
    COUNT(DISTINCT pd.payables)     AS payable_count,
    0::bigint                       AS petty_cash_count,
    0::bigint                       AS vehicle_usage_count
FROM accounting.payables_detials pd
         JOIN accounting.payables p ON p.id = pd.payables
         JOIN projects.projects pr ON pr.id = pd.project
         LEFT JOIN accounting.ap_trans_types att ON att.id = pd.trans_type
WHERE p.posted IS TRUE
  AND p.company = pr.company
GROUP BY pd.project, pr.description, pd.trans_type, att.description

UNION ALL

SELECT
    pci.project AS project_id,
    pr.description AS project_description,
    COALESCE(pc.transaction_type,
             '00000000-0000-0000-0000-000000000000'::uuid) AS trans_type,
    'PETTY_CASH' AS source_type,
    COALESCE(pc.pcv_category, 'UNSPECIFIED') AS source_category,
    COALESCE(att.description, 'PETTY CASH - ' || pc.pcv_category) AS trans_type_description,
    SUM(COALESCE(pci.net_amount, 0)) AS total_net_amount,
    COUNT(*) AS line_count,
    0::bigint AS payable_count,
    COUNT(DISTINCT pc.id) AS petty_cash_count,
    0::bigint AS vehicle_usage_count
FROM accounting.petty_cash_purchases pci
         JOIN accounting.petty_cash pc ON pc.id = pci.petty_cash
         JOIN projects.projects pr ON pr.id = pci.project
         LEFT JOIN accounting.ap_trans_types att ON att.id = pc.transaction_type
WHERE pc.posted IS TRUE
  AND pc.company = pr.company
GROUP BY pci.project, pr.description, pc.transaction_type, pc.pcv_category, att.description

UNION ALL

SELECT
    pco.project AS project_id,
    pr.description AS project_description,
    COALESCE(pc.transaction_type,
             '00000000-0000-0000-0000-000000000000'::uuid) AS trans_type,
    'PETTY_CASH' AS source_type,
    COALESCE(pc.pcv_category, 'UNSPECIFIED') AS source_category,
    COALESCE(att.description, 'PETTY CASH - ' || pc.pcv_category) AS trans_type_description,
    SUM(COALESCE(pco.amount, 0)) AS total_net_amount,
    COUNT(*) AS line_count,
    0::bigint AS payable_count,
    COUNT(DISTINCT pc.id) AS petty_cash_count,
    0::bigint AS vehicle_usage_count
FROM accounting.petty_cash_others pco
         JOIN accounting.petty_cash pc ON pc.id = pco.petty_cash
         JOIN projects.projects pr ON pr.id = pco.project
         LEFT JOIN accounting.ap_trans_types att ON att.id = pc.transaction_type
WHERE pc.posted IS TRUE
  AND pc.company = pr.company
GROUP BY pco.project, pr.description, pc.transaction_type, pc.pcv_category, att.description

UNION ALL

SELECT
    vu.project AS project_id,
    pr.description AS project_description,
    '00000000-0000-0000-0000-000000000000'::uuid AS trans_type,
    'VEHICLE_USAGE' AS source_type,
    vue.expense_type AS source_category,
    CASE vue.expense_type
        WHEN 'ITEM' THEN 'VEHICLE USAGE - ITEM'
        WHEN 'SERVICE' THEN 'VEHICLE USAGE - SERVICE'
        ELSE 'VEHICLE USAGE - CUSTOM'
    END AS trans_type_description,
    SUM(COALESCE(vue.amount, 0)) AS total_net_amount,
    COUNT(*) AS line_count,
    0::bigint AS payable_count,
    0::bigint AS petty_cash_count,
    COUNT(DISTINCT vu.id) AS vehicle_usage_count
FROM asset.vehicle_usage_expense vue
         JOIN asset.vehicle_usage_monitoring vu ON vu.id = vue.vehicle_usage
         JOIN projects.projects pr ON pr.id = vu.project
WHERE COALESCE(vue.deleted, false) IS FALSE
  AND COALESCE(vu.deleted, false) IS FALSE
  AND vue.company = vu.company
  AND vu.company = pr.company
GROUP BY vu.project, pr.description, vue.expense_type;
