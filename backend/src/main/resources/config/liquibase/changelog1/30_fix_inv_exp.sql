
-- inventory.expiryref source

CREATE OR REPLACE VIEW inventory.expiryref
AS WITH expiry AS (
         SELECT a.item,
            last_value(a.expiration_date) OVER (PARTITION BY a.item ORDER BY a.created_date RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS expiration_date
           FROM inventory.receiving_report_items a
          GROUP BY a.item, a.expiration_date, a.created_date
        )
 SELECT expiry.item,
    expiry.expiration_date
   FROM expiry
  GROUP BY expiry.item, expiry.expiration_date;


CREATE OR REPLACE VIEW inventory.inventory
AS SELECT a.id,
    a.item,
    a.office,
    a.reorder_quantity,
    a.allow_trade,
    COALESCE(c.onhand, 0::bigint) AS onhand,
    COALESCE(round(d.unitcost, 4), 0::numeric) AS last_unit_cost,
    COALESCE(f.expiration_date, NULL::date) AS expiration_date,
    b.desc_long,
    b.sku,
    b.item_code,
    b.active,
    a.office AS office_id,
    a.item AS item_id,
    b.item_group,
    b.item_category,
    b.production,
    b.is_medicine
   FROM inventory.office_item a
     LEFT JOIN inventory.onhandref c ON c.item = a.item AND c.source_office = a.office
     LEFT JOIN inventory.unitcostref d ON d.item = a.item
     LEFT JOIN inventory.expiryref f ON f.item = a.item
     LEFT JOIN inventory.item b ON b.id = a.item
  WHERE a.is_assign = true;