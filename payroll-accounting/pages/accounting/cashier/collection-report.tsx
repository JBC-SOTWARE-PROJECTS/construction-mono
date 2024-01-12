import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const CollectionReportComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/collection-report")
);

const CollectionReport = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Cashier Admin</title>
      </Head>
      <AccessManager roles={["ROLE_CASHIER", "ROLE_CASHIER"]}>
        <div className="w-full">
          <CollectionReportComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default CollectionReport;
