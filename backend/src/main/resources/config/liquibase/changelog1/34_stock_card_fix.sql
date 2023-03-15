DROP FUNCTION IF EXISTS inventory.stock_card;
CREATE OR REPLACE FUNCTION inventory.stock_card(itemid uuid, depid uuid)
 RETURNS TABLE(id uuid, source_office uuid, source_officename character varying, destination_office uuid, destination_officename character varying, document_types uuid, document_code character varying, document_desc character varying, item uuid, sku character varying, item_code character varying, desc_long character varying, reference_no character varying, ledger_date timestamp without time zone, ledger_qtyin integer, ledger_qty_out integer, adjustment integer, unitcost numeric, runningqty bigint, wcost numeric, runningbalance numeric)
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
DROP FUNCTION IF EXISTS inventory.stock_card_all;
CREATE OR REPLACE FUNCTION inventory.stock_card_all(itemid uuid)
 RETURNS TABLE(id uuid, source_office uuid, source_officename character varying, destination_office uuid, destination_officename character varying, document_types uuid, document_code character varying, document_desc character varying, item uuid, sku character varying, item_code character varying, desc_long character varying, reference_no character varying, ledger_date timestamp without time zone, ledger_qtyin integer, ledger_qty_out integer, adjustment integer, unitcost numeric, runningqty bigint, wcost numeric, runningbalance numeric)
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
