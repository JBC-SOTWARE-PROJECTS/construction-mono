import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const BatchReceiptsComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/batch-receipts")
);

const BatchReceipts = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Cashier Admin</title>
      </Head>
      <AccessManager roles={["ROLE_CASHIER_ADMIN", "ROLE_CASHIER"]}>
        <div className="w-full">
          <BatchReceiptsComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default BatchReceipts;
