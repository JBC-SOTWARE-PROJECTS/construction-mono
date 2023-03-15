import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const PRContent = dynamic(
  () => import("../../../../routes/main/Transaction/pr"),
  {
    loading: () => <CircularProgress />,
  }
);

const PurchaseRequest = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Purchase Request</title>
    </Head>
    <AccessManager roles={["ROLE_INVENTORY_PR", "ROLE_ADMIN"]}>
      <PRContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default PurchaseRequest;
