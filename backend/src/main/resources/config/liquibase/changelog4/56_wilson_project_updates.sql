ALTER TABLE projects.projects DROP CONSTRAINT IF EXISTS projects_customer_fkey;
ALTER TABLE billing.billing DROP CONSTRAINT IF EXISTS billing_customer_fkey;
ALTER TABLE billing.jobs DROP CONSTRAINT IF EXISTS jobs_customer_fkey;

