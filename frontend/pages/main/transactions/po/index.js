import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const POContent = dynamic(
  () => import("../../../../routes/main/Transaction/po"),
  {
    loading: () => <CircularProgress />,
  }
);

const PurchaseOrder = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Purchase Order</title>
    </Head>
    <AccessManager roles={["ROLE_INVENTORY_PO", "ROLE_ADMIN"]}>
      <POContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default PurchaseOrder;
