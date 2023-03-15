import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const SalesReportContent = dynamic(
  () => import("../../../routes/billing/reports/sales"),
  {
    loading: () => <CircularProgress />,
  }
);

const SalesReport = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Sales Report</title>
    </Head>
    <AccessManager roles={["ROLE_BILLING_REPORTS", "ROLE_ADMIN"]}>
      <SalesReportContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default SalesReport;
