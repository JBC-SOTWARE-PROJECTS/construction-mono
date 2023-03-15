import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const CRM = dynamic(() => import("../../../routes/main/Dashboard/CRM"), {
  loading: () => <CircularProgress />,
});

const CrmDashboard = () => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Dashboard</title>
    </Head>
    <AccessManager roles={["ROLE_USER", "ROLE_ADMIN"]}>
      <CRM />
    </AccessManager>
  </React.Fragment>
);

export default CrmDashboard;
