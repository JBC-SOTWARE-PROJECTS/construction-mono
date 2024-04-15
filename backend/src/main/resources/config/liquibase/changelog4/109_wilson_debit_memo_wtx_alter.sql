ALTER TABLE accounting.disbursement_wtx ADD COLUMN debit_memo uuid default null;
ALTER TABLE accounting.disbursement_wtx ADD CONSTRAINT disbursement_wtx_debit_memo_fkey FOREIGN KEY (debit_memo) REFERENCES accounting.debit_memo(id);

CREATE INDEX idx_disbursement_wtx_debit_memo ON accounting.disbursement_wtx USING btree (debit_memo);