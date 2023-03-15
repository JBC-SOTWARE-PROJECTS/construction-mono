INSERT INTO public.t_permission ("name", description) VALUES('price_control', 'Permission for Price & Markup Control');
INSERT INTO public.t_permission ("name", description) VALUES('po_delivery_monitoring', 'Permission for Purchase Order Delivery Monitoring');
INSERT INTO public.t_permission ("name", description) VALUES('pr_approver', 'Permission to Approve/Void Purchase Request');
INSERT INTO public.t_permission ("name", description) VALUES('po_approver', 'Permission to Approve/Void Purchase Order');
INSERT INTO public.t_permission ("name", description) VALUES('stock_card_admin', 'Stock Card Administrator');
INSERT INTO public.t_permission ("name", description) VALUES('allow_edit_qty_adjustment', 'Permission to Update Quantity Adjustment');
INSERT INTO public.t_permission ("name", description) VALUES('create_terminal', 'Permission to Add Cashier Terminal');


INSERT INTO public.t_authority ("name") VALUES('ROLE_CASHIER');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_MASTERFILE');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_TRANSACTION');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_PR');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_PO');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_DR');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_ISSUANCE_EXPENSE');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_MATERIAL_PROD');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_QUANTITY_ADJUST');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_BEGINNING_BAL');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_REPORTS');
INSERT INTO public.t_authority ("name") VALUES('ROLE_JOB_ESTIMATE');
INSERT INTO public.t_authority ("name") VALUES('ROLE_BUSINESS_FINANCE');
INSERT INTO public.t_authority ("name") VALUES('ROLE_BILLING');
INSERT INTO public.t_authority ("name") VALUES('ROLE_CASHIER_ADMIN');

