import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const CollectionContent = dynamic(
  () => import("../../../routes/cashier/collections"),
  {
    loading: () => <CircularProgress />,
  }
);

const Collections = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Cashier Collection Report</title>
    </Head>
    <AccessManager roles={["ROLE_CASHIER", "ROLE_ADMIN"]}>
      <CollectionContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Collections;
