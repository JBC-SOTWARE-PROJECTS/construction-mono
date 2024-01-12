import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const VoidPaymentComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/void-payments")
);

const VoidPayment = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Void Payments</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "ROLE_CASHIER_ADMIN"]}>
        <div className="w-full">
          <VoidPaymentComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default VoidPayment;
