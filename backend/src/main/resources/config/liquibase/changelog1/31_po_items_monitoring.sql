create or replace view  inventory.deliveredref as select
pdm.purchase_order_item,
sum(pdm.delivered_qty) as delivered_qty
from inventory.po_delivery_monitoring pdm
group by pdm.purchase_order_item;


create or replace view inventory.po_items_with_monitoring as select
poi.*,
coalesce(dr.delivered_qty, 0) as delivered_qty,
coalesce((poi.qty_in_small - dr.delivered_qty), poi.qty_in_small) as delivery_balance
from inventory.purchase_order_items poi
left join inventory.deliveredref dr on dr.purchase_order_item = poi.id
where
(poi.deleted is null or poi.deleted = false)
order by poi.purchase_order;