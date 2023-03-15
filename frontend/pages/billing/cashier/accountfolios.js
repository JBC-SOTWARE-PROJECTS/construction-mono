import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const CashierContent = dynamic(
  () => import("../../../routes/cashier/cashier"),
  {
    loading: () => <CircularProgress />,
  }
);

const CashierAccountFolios = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Cashier</title>
    </Head>
    <AccessManager roles={["ROLE_CASHIER", "ROLE_ADMIN"]}>
      <CashierContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default CashierAccountFolios;
