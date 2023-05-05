import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const JobContent = dynamic(() => import("../../../routes/assets/job-order"), {
  loading: () => <CircularProgress />,
});

const JobOrders = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Job Order List</title>
    </Head>
    <AccessManager roles={["ROLE_JOB_ORDER", "ROLE_ADMIN"]}>
      <JobContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default JobOrders;
