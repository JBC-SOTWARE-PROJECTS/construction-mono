import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const ADJContent = dynamic(
  () => import("../../../../routes/main/Transaction/adjustment"),
  {
    loading: () => <CircularProgress />,
  }
);

const MaterialProduction = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Qauntity Adjustment</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_QUANTITY_ADJUST"]}>
      <ADJContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default MaterialProduction;
