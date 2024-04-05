DROP FUNCTION IF EXISTS inventory.on_hand;
DROP FUNCTION IF EXISTS inventory.onhand_by_date;
DROP FUNCTION IF EXISTS inventory.stock_card;
DROP FUNCTION IF EXISTS inventory.stock_card_all;

DROP FUNCTION IF EXISTS inventory.expiry_by_date;
DROP FUNCTION IF EXISTS inventory.last_unit_price_by_date;
DROP FUNCTION IF EXISTS inventory.last_wcost;

DROP VIEW IF EXISTS inventory.inventory;
DROP VIEW IF EXISTS inventory.inventory_supplier;
DROP VIEW IF EXISTS inventory.po_items_with_monitoring;
DROP VIEW IF EXISTS inventory.unitcostref;
DROP VIEW IF EXISTS inventory.onhandref;
DROP VIEW IF EXISTS inventory.expiryref;
DROP VIEW IF EXISTS inventory.deliveredref;




ALTER TABLE inventory.beginning_balance ALTER COLUMN quantity TYPE numeric USING quantity::numeric;

ALTER TABLE inventory.inventory_ledger ALTER COLUMN ledger_qty_in TYPE numeric USING ledger_qty_in::numeric;
ALTER TABLE inventory.inventory_ledger ALTER COLUMN ledger_qty_out TYPE numeric USING ledger_qty_out::numeric;
ALTER TABLE inventory.inventory_ledger ALTER COLUMN ledger_physical TYPE numeric USING ledger_physical::numeric;

ALTER TABLE inventory.material_production_item ALTER COLUMN qty TYPE numeric USING qty::numeric;

ALTER TABLE inventory.po_delivery_monitoring ALTER COLUMN delivered_qty TYPE numeric USING delivered_qty::numeric;

ALTER TABLE inventory.purchase_request_items ALTER COLUMN requested_qty TYPE numeric USING requested_qty::numeric;
ALTER TABLE inventory.purchase_request_items ALTER COLUMN on_hand_qty TYPE numeric USING on_hand_qty::numeric;


ALTER TABLE inventory.quantity_adjustment ALTER COLUMN quantity TYPE numeric USING quantity::numeric;

ALTER TABLE inventory.receiving_report_items ALTER COLUMN rec_qty TYPE numeric USING rec_qty::numeric;


ALTER TABLE inventory.return_supplier_items ALTER COLUMN return_qty TYPE numeric USING return_qty::numeric;

ALTER TABLE inventory.stock_issue_items ALTER COLUMN issue_qty TYPE numeric USING issue_qty::numeric;

CREATE OR REPLACE FUNCTION inventory.expiry_by_date(itemid uuid, filterdate date)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
DECLARE expiry_date date;
BEGIN
		expiry_date = (
		    select expiration_date from inventory.receiving_report_items where item = itemid
            and DATE(created_date) <= filterdate
            order by created_date desc limit 1
		);
RETURN expiry_date;
END; $function$
;

CREATE OR REPLACE FUNCTION inventory.last_unit_price_by_date(itemid uuid, filterdate date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE last_unit_cost numeric(9, 2);
BEGIN
		last_unit_cost = (
            select
		    a.ledger_unit_cost as unitcost

		    from inventory.inventory_ledger a

		    where a.item = itemid and a.document_types IN ('254a07d3-e33a-491c-943e-b3fe6792c5fc', '0caab388-e53b-4e94-b2ea-f8cc47df6431', 'af7dc429-8352-4f09-b58c-26a0a490881c', '27d236bb-c023-44dc-beac-18ddfe1daf79', '37683c86-3038-4207-baf0-b51456fd7037')
		    and date(a.ledger_date) <= filterdate
		    and a.is_include = true
			--document Types (SRR, BEG, EP, MPO, PHY)
		    group by
		    a.ledger_date,
		    a.ledger_unit_cost

		    order by a.ledger_date desc limit 1
        );
RETURN last_unit_cost;
END; $function$
;

CREATE OR REPLACE FUNCTION inventory.last_wcost(itemid uuid)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE last_wcost numeric;
BEGIN
		last_wcost = (
            select
		    CASE
		        WHEN a.document_types = 'd12f0de2-cb65-42ab-bcdb-881ebce57045'
		            THEN a.ledger_unit_cost
		        WHEN a.document_types = '4f88d8d7-ecce-4538-a97b-88884b1e106e'
		            THEN abs(a.ledger_unit_cost)
		            ELSE  COALESCE(round((sum(a.ledger_unit_cost * (sum(a.ledger_qty_in - a.ledger_qty_out))) OVER (ORDER BY a.ledger_date)) / NULLIF((sum(a.ledger_qty_in - a.ledger_qty_out) OVER (ORDER BY a.ledger_date)),0),4),a.ledger_unit_cost)
		    END as wcost

		    from inventory.inventory_ledger a

		    where
		    --a.source_dep = depid and
		    a.item = itemid
		    and a.is_include = true

		    group by
		    a.document_types,
		    a.ledger_date,
		    a.ledger_qty_in,
		    a.ledger_qty_out,
		    a.ledger_unit_cost

		    order by a.ledger_date desc limit 1
		);
RETURN round(last_wcost,4);
END; $function$
;

CREATE OR REPLACE FUNCTION inventory.last_wcost_by_date(itemid uuid, filterdate date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE last_wcost numeric(9, 2);
BEGIN
		last_wcost = (
			select
		    CASE
		        WHEN a.document_types = 'd12f0de2-cb65-42ab-bcdb-881ebce57045'
		            THEN a.ledger_unit_cost
		        WHEN a.document_types = '4f88d8d7-ecce-4538-a97b-88884b1e106e'
		            THEN abs(a.ledger_unit_cost)
		            ELSE  COALESCE(round((sum(a.ledger_unit_cost * (sum(a.ledger_qty_in - a.ledger_qty_out))) OVER (ORDER BY a.ledger_date)) / NULLIF((sum(a.ledger_qty_in - a.ledger_qty_out) OVER (ORDER BY a.ledger_date)),0),2),a.ledger_unit_cost)
		    END as wcost

		    from inventory.inventory_ledger a

		    where
		    --a.source_dep = depid and
		    a.item = itemid
		    and date(a.ledger_date) <= filterdate
            and a.is_include = true

		    group by
		    a.document_types,
		    a.ledger_date,
		    a.ledger_qty_in,
		    a.ledger_qty_out,
		    a.ledger_unit_cost

		    order by a.ledger_date desc limit 1
		);
RETURN last_wcost;
END; $function$
;

CREATE OR REPLACE FUNCTION inventory.last_wcost_by_date(officeid uuid, itemid uuid, filterdate date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE last_wcost numeric(9, 2);
BEGIN
		last_wcost = (
			select
		    CASE
		        WHEN a.document_types = 'd12f0de2-cb65-42ab-bcdb-881ebce57045'
		            THEN a.ledger_unit_cost
		        WHEN a.document_types = '4f88d8d7-ecce-4538-a97b-88884b1e106e'
		            THEN abs(a.ledger_unit_cost)
		            ELSE  COALESCE(round((sum(a.ledger_unit_cost * (sum(a.ledger_qty_in - a.ledger_qty_out))) OVER (ORDER BY a.ledger_date)) / NULLIF((sum(a.ledger_qty_in - a.ledger_qty_out) OVER (ORDER BY a.ledger_date)),0),2),a.ledger_unit_cost)
		    END as wcost

		    from inventory.inventory_ledger a

		    where a.source_office = officeId and a.item = itemid
		    and date(a.ledger_date) <= filterdate
            and a.is_include = true

		    group by
		    a.document_types,
		    a.ledger_date,
		    a.ledger_qty_in,
		    a.ledger_qty_out,
		    a.ledger_unit_cost

		    order by a.ledger_date desc limit 1
		);
RETURN last_wcost;
END; $function$
;

CREATE OR REPLACE FUNCTION inventory.onhand_by_date(officeid uuid, itemid uuid, filterdate date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE qty numeric;
BEGIN
		qty = (select
			coalesce ((
			select
		    sum(a.ledger_qty_in - a.ledger_qty_out) OVER (ORDER BY a.ledger_date) as onHand

		    from inventory.inventory_ledger a

		    where a.source_office = officeId and a.item = itemid
		    and date(a.ledger_date) <= filterdate
		    and a.is_include = true

		    group BY
		    a.id,
		    a.ledger_date,
		    a.ledger_qty_in,
		    a.ledger_qty_out

		    order by a.ledger_date desc limit 1), 0) as onHand);
RETURN qty;
END; $function$
;

CREATE OR REPLACE FUNCTION inventory.on_hand(filterdate date, officeid uuid, filtertext character varying)
 RETURNS TABLE(id uuid, item uuid, desc_long character varying, unit_of_purchase character varying, unit_of_usage character varying, category_description character varying, office uuid, office_description character varying, onhand numeric, last_unit_cost numeric, last_wcost numeric, expiration_date date)
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


CREATE OR REPLACE FUNCTION inventory.stock_card(itemid uuid, depid uuid)
 RETURNS TABLE(id uuid, source_office uuid, source_officename character varying, destination_office uuid, destination_officename character varying, document_types uuid, document_code character varying, document_desc character varying, item uuid, sku character varying, item_code character varying, desc_long character varying, reference_no character varying, ledger_date timestamp without time zone, ledger_qtyin numeric, ledger_qty_out numeric, adjustment numeric, unitcost numeric, runningqty numeric, wcost numeric, runningbalance numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
select
    a.id,
    a.source_office,
    b.office_description as source_officename,
    a.destination_office,
    c.office_description as destination_officename,
    a.document_types,
    d.document_code,
    d.document_desc,
    a.item,
    e.sku,
    e.item_code,
    e.desc_long,
    a.reference_no,
    a.ledger_date,
    case
        when a.document_types = '4f88d8d7-ecce-4538-a97b-88884b1e106e'
            or a.document_types = '37683c86-3038-4207-baf0-b51456fd7037' then 0
        else a.ledger_qty_in end as ledger_qtyin,
    a.ledger_qty_out,
    case
        when a.document_types = '4f88d8d7-ecce-4538-a97b-88884b1e106e'
            or a.document_types = '37683c86-3038-4207-baf0-b51456fd7037' then a.ledger_qty_in
        else 0 end as adjustment,
    a.ledger_unit_cost as Unitcost,
    sum(a.ledger_qty_in - a.ledger_qty_out) over (
			order by a.ledger_date) as RunningQty,
        case
            when a.document_types = 'd12f0de2-cb65-42ab-bcdb-881ebce57045' then a.ledger_unit_cost
            when a.document_types = '4f88d8d7-ecce-4538-a97b-88884b1e106e' then abs(a.ledger_unit_cost)
            else coalesce(round((sum(a.ledger_unit_cost * (sum(a.ledger_qty_in - a.ledger_qty_out))) over (order by a.ledger_date)) / nullif((sum(a.ledger_qty_in - a.ledger_qty_out) over (order by a.ledger_date)), 0), 4), a.ledger_unit_cost) end as wcost,
    round(sum(abs(a.ledger_unit_cost) * (sum(a.ledger_qty_in - a.ledger_qty_out))) over (
				order by a.ledger_date), 4) as RunningBalance
from
    inventory.inventory_ledger a
        inner join public.office b on
            a.source_office = b.id
        inner join public.office c on
            a.destination_office = c.id
        inner join inventory.document_types d on
            a.document_types = d.id
        inner join inventory.item e on
            a.item = e.id
where
        a.source_office = depId and
        a.item = itemid
  and a.is_include = true
group by
    a.id,
    a.source_office,
    b.office_description,
    a.destination_office,
    c.office_description,
    a.document_types,
    d.document_code,
    d.document_desc,
    a.item,
    e.sku,
    e.item_code,
    e.desc_long,
    a.reference_no,
    a.ledger_date,
    a.ledger_qty_in,
    a.ledger_qty_out,
    a.ledger_unit_cost;
END;
$function$
;

CREATE OR REPLACE FUNCTION inventory.stock_card_all(itemid uuid)
 RETURNS TABLE(id uuid, source_office uuid, source_officename character varying, destination_office uuid, destination_officename character varying, document_types uuid, document_code character varying, document_desc character varying, item uuid, sku character varying, item_code character varying, desc_long character varying, reference_no character varying, ledger_date timestamp without time zone, ledger_qtyin numeric, ledger_qty_out numeric, adjustment numeric, unitcost numeric, runningqty bigint, wcost numeric, runningbalance numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
select
    a.id,
    a.source_office,
    b.office_description as source_officename,
    a.destination_office,
    c.office_description as destination_officename,
    a.document_types,
    d.document_code,
    d.document_desc,
    a.item,
    e.sku,
    e.item_code,
    e.desc_long,
    a.reference_no,
    a.ledger_date,
    case
        when a.document_types = '4f88d8d7-ecce-4538-a97b-88884b1e106e'
            or a.document_types = '37683c86-3038-4207-baf0-b51456fd7037' then 0
        else a.ledger_qty_in end as ledger_qtyin,
    a.ledger_qty_out,
    case
        when a.document_types = '4f88d8d7-ecce-4538-a97b-88884b1e106e'
            or a.document_types = '37683c86-3038-4207-baf0-b51456fd7037' then a.ledger_qty_in
        else 0 end as adjustment,
    a.ledger_unit_cost as Unitcost,
    sum(a.ledger_qty_in - a.ledger_qty_out) over (
			order by a.ledger_date) as RunningQty,
        case
            when a.document_types = 'd12f0de2-cb65-42ab-bcdb-881ebce57045' then a.ledger_unit_cost
            when a.document_types = '4f88d8d7-ecce-4538-a97b-88884b1e106e' then abs(a.ledger_unit_cost)
            else coalesce(round((sum(a.ledger_unit_cost * (sum(a.ledger_qty_in - a.ledger_qty_out))) over (order by a.ledger_date)) / nullif((sum(a.ledger_qty_in - a.ledger_qty_out) over (order by a.ledger_date)), 0), 4), a.ledger_unit_cost) end as wcost,
    round(sum(abs(a.ledger_unit_cost) * (sum(a.ledger_qty_in - a.ledger_qty_out))) over (
				order by a.ledger_date), 4) as RunningBalance
from
    inventory.inventory_ledger a
        inner join public.office b on
            a.source_office = b.id
        inner join public.office c on
            a.destination_office = c.id
        inner join inventory.document_types d on
            a.document_types = d.id
        inner join inventory.item e on
            a.item = e.id
where
  --a.source_office = depId and
        a.item = itemid
  and a.is_include = true
group by
    a.id,
    a.source_office,
    b.office_description,
    a.destination_office,
    c.office_description,
    a.document_types,
    d.document_code,
    d.document_desc,
    a.item,
    e.sku,
    e.item_code,
    e.desc_long,
    a.reference_no,
    a.ledger_date,
    a.ledger_qty_in,
    a.ledger_qty_out,
    a.ledger_unit_cost;
END;
$function$
;


CREATE OR REPLACE VIEW inventory.unitcostref
AS WITH samp AS (
         SELECT a.item,
            last_value(a.ledger_unit_cost) OVER (PARTITION BY a.item ORDER BY a.ledger_date RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS unitcost
           FROM inventory.inventory_ledger a
          WHERE (a.document_types = ANY (ARRAY['254a07d3-e33a-491c-943e-b3fe6792c5fc'::uuid, '0caab388-e53b-4e94-b2ea-f8cc47df6431'::uuid, 'af7dc429-8352-4f09-b58c-26a0a490881c'::uuid, '27d236bb-c023-44dc-beac-18ddfe1daf79'::uuid, '37683c86-3038-4207-baf0-b51456fd7037'::uuid, '27d236bb-c023-44dc-beac-18ddfe1daf79'::uuid])) AND a.is_include = true
          GROUP BY a.item, a.ledger_unit_cost, a.ledger_date
        )
SELECT samp.item,
       samp.unitcost
FROM samp
GROUP BY samp.item, samp.unitcost;



CREATE OR REPLACE VIEW inventory.onhandref
AS SELECT a.source_office,
          a.item,
          sum(a.ledger_qty_in - a.ledger_qty_out) AS onhand
   FROM inventory.inventory_ledger a
   WHERE a.is_include = true
   GROUP BY a.source_office, a.item;


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

CREATE OR REPLACE VIEW inventory.deliveredref
AS SELECT pdm.purchase_order_item,
          sum(pdm.delivered_qty) AS delivered_qty
   FROM inventory.po_delivery_monitoring pdm
   GROUP BY pdm.purchase_order_item;


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
          e.vat_rate,
          b.brand,
          b.fix_asset,
          b.consignment,
          a.company
   FROM inventory.office_item a
            LEFT JOIN inventory.onhandref c ON c.item = a.item AND c.source_office = a.office
            LEFT JOIN inventory.unitcostref d ON d.item = a.item
            LEFT JOIN inventory.item b ON b.id = a.item
            LEFT JOIN company e ON e.id = a.company
   WHERE a.is_assign = true AND b.active = true;



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


CREATE OR REPLACE VIEW inventory.po_items_with_monitoring
AS SELECT poi.id,
          poi.purchase_order,
          poi.item,
          poi.quantity,
          poi.unit_cost,
          poi.pr_nos,
          poi.qty_in_small,
          poi.type,
          poi.type_text,
          poi.created_by,
          poi.created_date,
          poi.last_modified_by,
          poi.last_modified_date,
          poi.deleted,
          poi.receiving_report,
          COALESCE(dr.delivered_qty, 0::bigint) AS delivered_qty,
          COALESCE(poi.qty_in_small - dr.delivered_qty, poi.qty_in_small::bigint) AS delivery_balance
   FROM inventory.purchase_order_items poi
            LEFT JOIN inventory.deliveredref dr ON dr.purchase_order_item = poi.id
   WHERE poi.deleted IS NULL OR poi.deleted = false
   ORDER BY poi.purchase_order;





ALTER TABLE projects.projects_updates_materials ALTER COLUMN on_hand TYPE name USING on_hand::name;
ALTER TABLE projects.projects_updates_materials ALTER COLUMN qty TYPE numeric USING qty::numeric;
ALTER TABLE projects.projects_updates_materials ALTER COLUMN balance TYPE numeric USING balance::numeric;

ALTER TABLE billing.job_items ALTER COLUMN qty TYPE numeric USING qty::numeric;

ALTER TABLE accounting.petty_cash_purchases ALTER COLUMN qty TYPE numeric USING qty::numeric;

ALTER TABLE services.service_items ALTER COLUMN qty TYPE numeric USING qty::numeric;




