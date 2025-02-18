import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const CashierComponent = asyncComponent(
  () => import("@/routes/accounting/cashier")
);

const Cashier = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Cashier </title>
      </Head>
      <AccessManager roles={["ROLE_CASHIER", "ROLE_CASHIER"]}>
        <div className="w-full">
          <CashierComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default Cashier;
