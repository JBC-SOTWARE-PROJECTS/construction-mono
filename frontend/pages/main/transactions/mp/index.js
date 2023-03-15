import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const MPContent = dynamic(
  () => import("../../../../routes/main/Transaction/material"),
  {
    loading: () => <CircularProgress />,
  }
);

const MaterialProduction = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Material Production</title>
    </Head>
    <AccessManager roles={["ROLE_INVENTORY_MATERIAL_PROD", "ROLE_ADMIN"]}>
      <MPContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default MaterialProduction;
