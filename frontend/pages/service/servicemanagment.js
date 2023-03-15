import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../app/components/CircularProgress";
import AccessManager from "../../app/components/accessControl/AccessManager";

const ServiceContent = dynamic(() => import("../../routes/services"), {
  loading: () => <CircularProgress />,
});

const Terminals = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Services Management</title>
    </Head>
    <AccessManager roles={["ROLE_SERVICE_MANAGEMENT", "ROLE_ADMIN"]}>
      <ServiceContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Terminals;
