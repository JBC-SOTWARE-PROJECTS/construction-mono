CREATE TABLE public.company (
    id          uuid not null primary key,
    com_name    varchar,
    vat_rate    numeric,
    markup      numeric,
    gov_markup  numeric,
    logo        varchar
);

INSERT INTO public.company (id, com_name, vat_rate, markup, gov_markup, logo) VALUES('ee58932e-ab09-4cce-b46d-ef3477db84a6', 'AMS CREA''SION DIGITAL ADVERTISING SERVICE', 0.12, 0.50, 0.07, NULL);

