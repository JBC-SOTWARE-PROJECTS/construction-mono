import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const BillingContent = dynamic(
  () => import("../../../routes/billing/billing"),
  {
    loading: () => <CircularProgress />,
  }
);

const JobOrders = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Billing Accounts</title>
    </Head>
    <AccessManager roles={["ROLE_BILLING", "ROLE_ADMIN"]}>
      <BillingContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default JobOrders;
