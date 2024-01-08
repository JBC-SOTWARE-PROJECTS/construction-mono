ALTER TABLE accounting.release_checks DROP CONSTRAINT release_checks_company_fkey;
ALTER TABLE accounting.release_checks
    ADD CONSTRAINT release_checks_company_fkey FOREIGN KEY (company) REFERENCES public.company (id);