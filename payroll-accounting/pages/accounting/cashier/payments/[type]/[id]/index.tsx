import React from "react"
import asyncComponent from "@/utility/asyncComponent"
import { IUserEmployee } from "@/utility/interfaces"

const Payment = asyncComponent(
  () => import("@/routes/accounting/cashier/payments")
)

const PaymentPage = ({ account }: { account: IUserEmployee }) => {
  return <Payment {...account} />
}

export default PaymentPage
