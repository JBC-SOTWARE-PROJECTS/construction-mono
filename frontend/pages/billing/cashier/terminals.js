import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const TerminalContent = dynamic(
  () => import("../../../routes/cashier/terminals"),
  {
    loading: () => <CircularProgress />,
  }
);

const Terminals = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Cashier Terminal</title>
    </Head>
    <AccessManager roles={["ROLE_CASHIER", "ROLE_ADMIN"]}>
      <TerminalContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Terminals;
