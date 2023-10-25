const AccountingAccountsPayableMenu = {
  route: {
    path: "/",
    routes: [
      {
        path: "/accounting/accounts-payable",
        name: "Account Payables",
        routes: [
          {
            path: "/accounting/accounts-payable/payables",
            name: "Payables",
          },
          {
            path: "/accounting/accounts-payable/2307",
            name: "2307",
          },
          {
            path: "/accounting/accounts-payable/disbursement-vouchers",
            name: "Disbursement",
          },
          {
            path: "/accounting/accounts-payable/disbursement-reapplication",
            name: "Reapplication",
          },
          {
            path: "/accounting/accounts-payable/checks",
            name: "Print Checks",
          },
          {
            path: "/accounting/accounts-payable/releasing-checks",
            name: "Releasing of Checks",
          },
          {
            path: "/accounting/accounts-payable/pettycash-vouchers",
            name: "Petty Cash Vouchers",
          },
          {
            path: "/accounting/accounts-payable/debit-memo",
            name: "Debit Memo",
          },
          {
            path: "/accounting/accounts-payable/debit-advice",
            name: "Debit Advice",
          },
        ],
      },
      {
        path: "/accounting/accounts-payable/config",
        name: "Configuration",
        routes: [
          {
            path: "/accounting/accounts-payable/config/transaction-type",
            name: "Accounts Payables",
          },
          {
            path: "/accounting/accounts-payable/config/disbursement-type",
            name: "Disbursement",
          },
          {
            path: "/accounting/accounts-payable/config/petty-cash-type",
            name: "Petty Cash",
          },
          {
            path: "/accounting/accounts-payable/config/debit-memo-type",
            name: "Debit Memo",
          },
          {
            path: "/accounting/accounts-payable/config/debit-advice-type",
            name: "Debit Advice",
          },
        ],
      },
      {
        path: "/accounting/accounts-payable/reports",
        name: "Reports",
        routes: [
          {
            path: "/accounting/accounts-payable/reports/subsidiary-ledger",
            name: "Subsidiary Ledger",
          },
          {
            path: "/accounting/accounts-payable/reports/aging-summary",
            name: "AP Aging Summary",
          },
          {
            path: "/accounting/accounts-payable/reports/aging-detailed",
            name: "AP Aging Detialed",
          },
        ],
      },
      {
        path: "/accounting/accounts-payable/templates",
        name: "Accounts Templates",
        routes: [
          {
            path: "/accounting/accounts-payable/templates/accounts",
            name: "Templates",
          },
        ],
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default AccountingAccountsPayableMenu;
