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
            path: "/accounting/accounts-payable/wtx",
            name: "2307",
          },
          {
            path: "/accounting/accounts-payable/disbursement-vouchers",
            name: "Disbursement Vouchers",
          },
          {
            path: "/accounting/accounts-payable/disbursement-reapplication",
            name: "Disbursement Reapplication",
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
          {
            path: "/accounting/accounts-payable/config-reports",
            name: "Configuration & Reports",
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
