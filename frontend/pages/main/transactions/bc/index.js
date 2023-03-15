import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const BeginningContent = dynamic(
  () => import("../../../../routes/main/Transaction/beginning"),
  {
    loading: () => <CircularProgress />,
  }
);

const BeginningBalance = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Beginning Balance</title>
    </Head>
    <AccessManager roles={["ROLE_INVENTORY_BEGINNING_BAL", "ROLE_ADMIN"]}>
      <BeginningContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default BeginningBalance;
