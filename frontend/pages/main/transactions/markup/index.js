import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const MarkupContent = dynamic(
  () => import("../../../../routes/main/Transaction/markup"),
  {
    loading: () => <CircularProgress />,
  }
);

const MaterialProduction = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Markup Control</title>
    </Head>
    <AccessManager roles={["ROLE_INVENTORY_COST_MARKUP_CONTROL", "ROLE_ADMIN"]}>
      <MarkupContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default MaterialProduction;
