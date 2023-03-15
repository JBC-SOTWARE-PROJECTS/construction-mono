import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const RTSContent = dynamic(
  () => import("../../../../routes/main/Transaction/rts"),
  {
    loading: () => <CircularProgress />,
  }
);

const ReturnSupplier = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Return to Supplier</title>
    </Head>
    <AccessManager roles={["ROLE_INVENTORY_RETURN_SUPPLIER", "ROLE_ADMIN"]}>
      <RTSContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default ReturnSupplier;
