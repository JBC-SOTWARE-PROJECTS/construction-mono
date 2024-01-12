CREATE OR REPLACE VIEW inventory.inventory_supplier
AS SELECT a.id,
          a.item_id,
          b.desc_long,
          b.sku,
          b.item_code,
          a.supplier,
          c.source_office,
          a.cost AS unit_cost,
          COALESCE(c.onhand, 0::bigint) AS onhand,
          a.company
   FROM inventory.supplier_item a
            LEFT JOIN inventory.onhandref c ON c.item = a.item_id
            LEFT JOIN inventory.item b ON b.id = a.item_id
   WHERE (a.deleted = false OR a.deleted IS NULL) AND b.active = true;