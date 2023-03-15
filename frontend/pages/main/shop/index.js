import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const InvMonitoringContent = dynamic(
  () => import("../../../routes/main/Shop"),
  {
    loading: () => <CircularProgress />,
  }
);

const InventoryMonitoring = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Inventory Monitoring</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY"]}>
      <InvMonitoringContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default InventoryMonitoring;
