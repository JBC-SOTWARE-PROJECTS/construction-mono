import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const CashierAdminComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/accounts")
);

const CashierAdmin = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Cashier Admin</title>
      </Head>
      <AccessManager roles={["ROLE_CASHIER_ADMIN", "ROLE_CASHIER"]}>
        <div className="w-full">
          <CashierAdminComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default CashierAdmin;
