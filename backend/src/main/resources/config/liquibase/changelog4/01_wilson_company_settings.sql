ALTER TABLE public.company ADD COLUMN com_code varchar default null,
ADD COLUMN is_active bool NULL DEFAULT true,
ADD COLUMN hide_in_selection bool NULL DEFAULT false;



