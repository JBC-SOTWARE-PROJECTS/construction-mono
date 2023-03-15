import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const CashTransactionContent = dynamic(
  () => import("../../../routes/cashier/cashtransaction"),
  {
    loading: () => <CircularProgress />,
  }
);

const CashTransaction = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Cash Transaction</title>
    </Head>
    <AccessManager roles={["ROLE_CASHIER", "ROLE_ADMIN"]}>
      <CashTransactionContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default CashTransaction;
