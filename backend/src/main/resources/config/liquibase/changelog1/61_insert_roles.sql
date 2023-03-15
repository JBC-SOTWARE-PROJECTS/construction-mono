INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_COST_MARKUP_CONTROL');
INSERT INTO public.t_authority ("name") VALUES('ROLE_INVENTORY_RETURN_SUPPLIER');
INSERT INTO public.t_authority ("name") VALUES('ROLE_SERVICE_MANAGEMENT');

UPDATE public.t_authority SET "name"='ROLE_BILLING_REPORTS'  WHERE "name"='ROLE_BUSINESS_FINANCE';
DELETE FROM public.t_authority WHERE "name"='ROLE_INVENTORY_TRANSACTION';
DELETE FROM public.t_permission WHERE "name"='stock_card_admin';


