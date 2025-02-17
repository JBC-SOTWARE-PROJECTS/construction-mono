import React from "react"
import asyncComponent from "@/utility/asyncComponent"
import Head from "next/head"
import AccessManager from "@/components/accessControl/AccessManager"
import { IUserEmployee } from "@/utility/interfaces"

const PaymentsComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/payments")
)

const Cashiering = ({ account }: { account: IUserEmployee }) => {
  return (
    <React.Fragment>
      <Head>
        <title>Cashier</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "ROLE_CASHIER"]}>
        <div className="w-full">
          <PaymentsComponent {...account} />;
        </div>
      </AccessManager>
    </React.Fragment>
  )
}

export default Cashiering
