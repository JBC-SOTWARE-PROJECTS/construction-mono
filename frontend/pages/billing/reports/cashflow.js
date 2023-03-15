import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const CashFlowContent = dynamic(
  () => import("../../../routes/billing/reports/cashflow"),
  {
    loading: () => <CircularProgress />,
  }
);

const CashFlow = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Cash Flow</title>
    </Head>
    <AccessManager roles={["ROLE_BILLING_REPORTS", "ROLE_ADMIN"]}>
      <CashFlowContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default CashFlow;
