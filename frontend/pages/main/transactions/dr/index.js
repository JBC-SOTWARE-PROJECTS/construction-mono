import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const DRContent = dynamic(
  () => import("../../../../routes/main/Transaction/dr"),
  {
    loading: () => <CircularProgress />,
  }
);

const DeliveryReceiving = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Delivery Receiving</title>
    </Head>
    <AccessManager roles={["ROLE_INVENTORY_DR", "ROLE_ADMIN"]}>
      <DRContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default DeliveryReceiving;
