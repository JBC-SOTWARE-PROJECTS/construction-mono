INSERT INTO public.t_authority
("name")
VALUES('ROLE_PROJECT_ACCOMPLISHMENT_REPORTS');

INSERT INTO public.t_permission
("name", description)
VALUES('edit_accomplishment_date', 'Permission to Edit Accomplishment Date');

INSERT INTO public.t_permission
("name", description)
VALUES('overwrite_lock_accomplishment', 'Permission to Overwrite Lock Accomplishment');