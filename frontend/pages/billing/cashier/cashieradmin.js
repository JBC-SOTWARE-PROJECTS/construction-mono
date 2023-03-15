import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const CAContent = dynamic(() => import("../../../routes/cashier/admin"), {
  loading: () => <CircularProgress />,
});

const CashierAdmin = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Cashier Admin</title>
    </Head>
    <AccessManager roles={["ROLE_CASHIER_ADMIN", "ROLE_ADMIN"]}>
      <CAContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default CashierAdmin;
