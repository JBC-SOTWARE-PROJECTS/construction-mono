import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const CashierComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/accounts")
);

const Cashiering = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Cashier</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "ROLE_CASHIER"]}>
        <div className="w-full">
          <CashierComponent />;
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default Cashiering;
