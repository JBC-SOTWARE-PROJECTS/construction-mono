drop function if exists inventory.on_hand;
CREATE OR REPLACE FUNCTION inventory.on_hand(filterDate date, officeId uuid, filterText varchar)
 RETURNS TABLE(id uuid, item uuid, desc_long character varying, unit_of_purchase character varying, 
 unit_of_usage character varying, category_description character varying, office uuid, 
 office_description character varying, onhand integer, last_unit_cost numeric, last_wcost numeric, 
 expiration_date date)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
a.id, 
a.item, 
b.desc_long,
c.unit_description as unit_of_purchase, 
d.unit_description as unit_of_usage, 
e.category_description ,
a.office , 
f.office_description,
COALESCE((SELECT inventory.onhand_by_date(a.office, a.item, filterDate)),0) as onhand,
COALESCE((SELECT inventory.last_unit_price_by_date(a.item, filterDate)),0) as last_unit_cost, 
COALESCE((SELECT inventory.last_wcost_by_date(a.item, filterDate)),0) as last_wcost, 
COALESCE((SELECT inventory.expiry_by_date(a.item, filterDate)),NULL) as expiration_date 
FROM
inventory.office_item as a,
inventory.item as b,
inventory.unit_measurements as c, 
inventory.unit_measurements as d,
inventory.item_categories as e,
public.office as f
where 
a.item = b.id AND
b.unit_of_purchase = c.id AND
b.unit_of_usage = d.id AND
b.item_category = e.id AND
a.office  = f.id AND
lower(b.desc_long)  like lower(concat('%',filterText,'%')) AND b.active = true AND
a.office = officeId order by b.desc_long;
END;
$function$
;