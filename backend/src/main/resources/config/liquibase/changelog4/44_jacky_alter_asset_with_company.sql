ALTER TABLE asset.assets  add column company uuid;
ALTER TABLE asset.assets
    ADD CONSTRAINT company_fkey FOREIGN KEY (company) REFERENCES public.company (id);