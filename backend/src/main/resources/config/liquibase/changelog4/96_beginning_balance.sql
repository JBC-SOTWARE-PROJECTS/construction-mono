CREATE OR REPLACE VIEW inventory.onhandbegref
AS SELECT a.office,
          a.item,
          sum(a.quantity) AS onhand,
          sum(a.unit_cost) AS unitcost
   FROM inventory.beginning_balance a
   WHERE (a.deleted is null or a.deleted is false) and a.is_posted = true
   GROUP BY a.office, a.item;