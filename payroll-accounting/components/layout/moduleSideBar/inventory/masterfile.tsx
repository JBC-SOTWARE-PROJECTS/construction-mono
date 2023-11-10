const AccountingAccountsPayableMenu = {
  route: {
    path: "/inventory",
    routes: [
      {
        path: "/inventory/masterfile/items",
        name: "Item Masterfile",
        routes: [
          {
            path: "/inventory/masterfile/items/all",
            name: "All Items",
          },
          {
            path: "/inventory/masterfile/items/productions",
            name: "Production",
          },
          {
            path: "/inventory/masterfile/items/fix-assets",
            name: "Fix Assets",
          },
          {
            path: "/inventory/masterfile/items/consignments",
            name: "Consignments",
          },
        ],
      },
      {
        path: "/inventory/masterfile/supplier",
        name: "Supplier Masterfile",
        routes: [
          {
            path: "/inventory/masterfile/supplier",
            name: "Supplier",
          },
        ],
      },
      {
        path: "/inventory/masterfile/signatures",
        name: "Signature Setup",
        routes: [
          {
            path: "/inventory/masterfile/signatures/purchase-request",
            name: "Purchase Request",
          },
          {
            path: "/inventory/masterfile/signatures/purchase-order",
            name: "Purchase Order",
          },
          {
            path: "/inventory/masterfile/signatures/delivery-receiving",
            name: "Delivery Receiving",
          },
        ],
      },
      {
        path: "/inventory/masterfile/transaction-types",
        name: "Transaction Types",
        routes: [
          {
            path: "/inventory/masterfile/transaction-types/delivery-receiving",
            name: "Delivery Receiving",
          },
          {
            path: "/inventory/masterfile/transaction-types/retrun-supplier",
            name: "Return Supplier",
          },
          {
            path: "/inventory/masterfile/transaction-types/issuances",
            name: "Issuances and Expense",
          },
          {
            path: "/inventory/masterfile/transaction-types/production",
            name: "Material Production",
          },
        ],
      },
      {
        path: "/inventory/masterfile/other-configurations",
        name: "Other Configuration",
        routes: [
          {
            path: "/inventory/masterfile/other-configurations/groups",
            name: "Item Groups",
          },
          {
            path: "/inventory/masterfile/other-configurations/category",
            name: "Item Category",
          },
          {
            path: "/inventory/masterfile/other-configurations/accounring-category",
            name: "Accounting Sub Account Category",
          },
          {
            path: "/inventory/masterfile/other-configurations/measurements",
            name: "Unit Measurements",
          },
          {
            path: "/inventory/masterfile/other-configurations/generics",
            name: "Generics Name",
          },
          {
            path: "/inventory/masterfile/other-configurations/supplier-types",
            name: "Supplier Types",
          },
          {
            path: "/inventory/masterfile/other-configurations/payment-terms",
            name: "Payment Terms",
          },
          {
            path: "/inventory/masterfile/other-configurations/project-status",
            name: "Project Status",
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
