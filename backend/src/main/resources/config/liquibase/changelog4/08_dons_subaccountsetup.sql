CREATE TABLE accounting.subaccount_setup (
    id uuid NULL,
    description varchar NULL,
    subaccount_code varchar NULL,
    subaccount_parent uuid NULL,
    subaccount_type varchar NULL,
    include_department bool NULL,
    attr_beginning_balance bool NULL,
    attr_credit_memo_adj bool NULL,
    attr_accrual_of_income bool NULL,
    attr_non_trade_cash_receipts bool NULL,
    attr_include_posting_accrued_income_multiple_customer bool NULL,
    attr_vatable bool NULL,
    attr_inactive bool NULL,
    attr_expense_account bool NULL,
    attr_debit_memo_adjustment bool NULL,
    attr_accrual_expense bool NULL,
    source_domain varchar NULL,

    category varchar NULL,
    require_remarks bool NULL,
    attached_value numeric NULL,
    department_includes varchar NULL,

    ADD COLUMN "created_by" varchar NULL COLLATE "default",
    ADD COLUMN	"created_date" timestamp  NULL DEFAULT current_timestamp,
    ADD COLUMN	"last_modified_by" varchar COLLATE "default",
    ADD COLUMN	"last_modified_date" timestamp NULL DEFAULT current_timestamp,

    CONSTRAINT subaccount_setup_pk PRIMARY KEY (id),
    CONSTRAINT subaccount_setup_fk_1 FOREIGN KEY (subaccount_parent) REFERENCES accounting.subaccount_setup(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE accounting.subaccount_parent_accounts (
   id uuid NULL,
   sub_account uuid NULL,
   parent_account uuid NULL,
   CONSTRAINT subaccount_parent_accounts_pk PRIMARY KEY (id),
   CONSTRAINT subaccount_parent_accounts_fk FOREIGN KEY (sub_account) REFERENCES accounting.subaccount_setup(id) ON DELETE CASCADE ON UPDATE CASCADE,
   CONSTRAINT subaccount_parent_accounts_fk_1 FOREIGN KEY (chart_of_account) REFERENCES accounting.chart_of_accounts(id) ON DELETE RESTRICT ON UPDATE CASCADE

   ADD COLUMN "created_by" varchar NULL COLLATE "default",
   ADD COLUMN	"created_date" timestamp  NULL DEFAULT current_timestamp,
   ADD COLUMN	"last_modified_by" varchar COLLATE "default",
   ADD COLUMN	"last_modified_date" timestamp NULL DEFAULT current_timestamp
);
