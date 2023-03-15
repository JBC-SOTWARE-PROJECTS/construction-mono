import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const OnHandContent = dynamic(
  () => import("../../../../routes/main/Reports/onhand"),
  {
    loading: () => <CircularProgress />,
  }
);

const OnHand = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Reports On Hand</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_REPORTS"]}>
      <OnHandContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default OnHand;
