import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const JobContent = dynamic(() => import("../../../routes/billing/jobs"), {
  loading: () => <CircularProgress />,
});

const JobOrders = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Job Order List</title>
    </Head>
    <AccessManager roles={["ROLE_BILLING", "ROLE_ADMIN"]}>
      <JobContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default JobOrders;
