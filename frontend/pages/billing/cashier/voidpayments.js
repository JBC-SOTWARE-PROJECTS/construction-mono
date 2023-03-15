import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const VoidContent = dynamic(() => import("../../../routes/cashier/void"), {
  loading: () => <CircularProgress />,
});

const VoidPayments = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Cashier Void OR</title>
    </Head>
    <AccessManager roles={["ROLE_CASHIER_ADMIN", "ROLE_ADMIN"]}>
      <VoidContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default VoidPayments;
