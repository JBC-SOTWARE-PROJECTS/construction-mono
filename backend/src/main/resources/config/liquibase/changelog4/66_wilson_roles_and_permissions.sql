INSERT INTO public.t_authority
("name")
VALUES('ROLE_PROJECT_BILL_QUANTITIES');

INSERT INTO public.t_permission
("name", description)
VALUES('show_project_cost', 'Permission to Show Project Total Cost');

INSERT INTO public.t_permission
("name", description)
VALUES('bill_of_quantities_revision', 'Permission to Revise Bill of Quantities');

INSERT INTO public.t_permission
("name", description)
VALUES('add_bill_of_quantities', 'Permission to Add Bill of Quantities');