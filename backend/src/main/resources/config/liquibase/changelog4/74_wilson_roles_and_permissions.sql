INSERT INTO public.t_authority
("name")
VALUES('ROLE_PROJECT_PROGRESS_REPORT');

INSERT INTO public.t_permission
("name", description)
VALUES('edit_progress_date', 'Permission to Edit Progress Report Date');

INSERT INTO public.t_permission
("name", description)
VALUES('overwrite_lock_progress', 'Permission to Overwrite Lock Progress Report');