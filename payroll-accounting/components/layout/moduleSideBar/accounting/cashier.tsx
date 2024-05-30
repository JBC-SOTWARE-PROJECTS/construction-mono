import { MenuOutlined } from "@ant-design/icons"

export function isCashieringTerminal(currentRoute: string) {
  const paymentTypes = [
    "project-payments",
    "otc-payments",
    "miscellaneous-payments-or",
    "miscellaneous-payments-ar",
  ]
  const urls = currentRoute.split("/").filter(Boolean)
  if (urls[0] == "accounting") {
    if (urls[1] == "cashier") {
      if (urls[2] == "payments" && urls[3] != undefined) {
        console.log(urls[3], "urls[3]")
        console.log(urls[3] == undefined, "urls[3]")
        if (paymentTypes.includes(urls[3]) && urls[3] != undefined) return true
        else window.location.replace("/accounting/cashier/payments")
      }
    }
  }
  return false
}

const CashierSideBarMenu = {
  route: {
    path: "/",
    routes: [
      {
        path: "/accounting/cashier",
        name: "Financial P.O.S (Cashiering)",
        routes: [
          {
            path: "/accounting/cashier/accounts",
            name: "Account Folios",
          },
          {
            path: "/accounting/cashier/void-payments",
            name: "Void Payments",
          },
          {
            path: "/accounting/cashier/terminal-setup",
            name: "Terminals",
          },
          {
            path: "/accounting/cashier/collection-report",
            name: "Collection Reports",
          },
          // {
          //   path: "/accounting/cashier/cashier-admin",
          //   name: "Cashier Admin",
          // },
          // {
          //   path: "/accounting/cashier/consolidation-report",
          //   name: "Consolidation Reports",
          // },
        ],
      },
    ],
  },
  location: {
    pathname: "/",
  },
}

export default CashierSideBarMenu
