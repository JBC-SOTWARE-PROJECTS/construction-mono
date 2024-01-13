import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const ConsolidationReportComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/accounts")
);

const ConsolidationReport = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Cashier Admin</title>
      </Head>
      <AccessManager roles={["ROLE_CASHIER_ADMIN", "ROLE_CASHIER"]}>
        <div className="w-full">
          <ConsolidationReportComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default ConsolidationReport;
