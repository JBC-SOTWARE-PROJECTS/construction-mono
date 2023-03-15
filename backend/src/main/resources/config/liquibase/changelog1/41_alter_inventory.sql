DROP VIEW IF EXISTS inventory.inventory;
CREATE OR REPLACE VIEW inventory.inventory
AS SELECT a.id,
    a.item,
    a.office,
    a.reorder_quantity,
    a.actual_cost,
    a.output_tax,
    a.selling_price,
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
    b.is_medicine,
    b.vatable,
    e.gov_markup,
    e.vat_rate
   FROM inventory.office_item a
     LEFT JOIN inventory.onhandref c ON c.item = a.item AND c.source_office = a.office
     LEFT JOIN inventory.unitcostref d ON d.item = a.item
     LEFT JOIN inventory.expiryref f ON f.item = a.item
     LEFT JOIN inventory.item b ON b.id = a.item
     LEFT JOIN public.company e ON e.id = 'ee58932e-ab09-4cce-b46d-ef3477db84a6'
  WHERE a.is_assign = true;