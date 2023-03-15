import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const POMonContent = dynamic(
  () => import("../../../../routes/main/Transaction/poMon"),
  {
    loading: () => <CircularProgress />,
  }
);

const PurchaseOrderMonitoring = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Purchase Order Monitoring</title>
    </Head>
    <AccessManager roles={["ROLE_INVENTORY_PO", "ROLE_ADMIN"]}>
      <POMonContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default PurchaseOrderMonitoring;
