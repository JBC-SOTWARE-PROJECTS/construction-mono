ALTER TABLE projects.projects ADD CONSTRAINT projects_customer_fkey FOREIGN KEY (customer) REFERENCES accounting.ar_customers(id);
ALTER TABLE billing.billing ADD CONSTRAINT billing_customer_fkey FOREIGN KEY (customer) REFERENCES accounting.ar_customers(id);
ALTER TABLE billing.jobs ADD CONSTRAINT jobs_customer_fkey FOREIGN KEY (customer) REFERENCES accounting.ar_customers(id);