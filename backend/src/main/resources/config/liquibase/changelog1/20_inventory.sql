-- inventory.onhandref source

CREATE OR REPLACE VIEW inventory.onhandref
AS SELECT a.source_office,
    a.item,
    sum(a.ledger_qty_in - a.ledger_qty_out) AS onhand
   FROM inventory.inventory_ledger a
  WHERE a.is_include = true
  GROUP BY a.source_office, a.item;


  -- inventory.unitcostref source

CREATE OR REPLACE VIEW inventory.unitcostref
AS WITH samp AS (
         SELECT a.item,
            last_value(a.ledger_unit_cost) OVER (PARTITION BY a.item ORDER BY a.ledger_date RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS unitcost
           FROM inventory.inventory_ledger a
          WHERE (a.document_types = ANY (ARRAY['254a07d3-e33a-491c-943e-b3fe6792c5fc'::uuid, '0caab388-e53b-4e94-b2ea-f8cc47df6431'::uuid, 'af7dc429-8352-4f09-b58c-26a0a490881c'::uuid, '27d236bb-c023-44dc-beac-18ddfe1daf79'::uuid, '37683c86-3038-4207-baf0-b51456fd7037'::uuid, '27d236bb-c023-44dc-beac-18ddfe1daf79'::uuid])) AND a.is_include = true
          GROUP BY a.item, a.ledger_unit_cost, a.ledger_date
        ) --SRR,BEG,EP,PHY,MPO
 SELECT samp.item,
    samp.unitcost
   FROM samp
  GROUP BY samp.item, samp.unitcost;

-- inventory.inventory_supplier source

CREATE OR REPLACE VIEW inventory.inventory_supplier
AS SELECT a.id,
    a.item_id,
    b.desc_long,
    b.sku,
    b.item_code,
    a.supplier,
    c.source_office,
    a.cost AS unit_cost,
    COALESCE(c.onhand, 0::bigint) AS onhand
   FROM inventory.supplier_item a
     LEFT JOIN inventory.onhandref c ON c.item = a.item_id
     LEFT JOIN inventory.item b ON b.id = a.item_id
  WHERE (a.deleted = false OR a.deleted IS NULL) AND b.active = true;


-- inventory.inventory source

CREATE OR REPLACE VIEW inventory.inventory
AS SELECT a.id,
    a.item,
    a.office,
    a.reorder_quantity,
    a.allow_trade,
    COALESCE(c.onhand, 0::bigint) AS onhand,
    COALESCE(round(d.unitcost, 4), 0::numeric) AS last_unit_cost,
    COALESCE(NULL, NULL::date) AS expiration_date,
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
--      LEFT JOIN inventory.expiryref f ON f.item = a.item
     LEFT JOIN inventory.item b ON b.id = a.item
  WHERE a.is_assign = true;