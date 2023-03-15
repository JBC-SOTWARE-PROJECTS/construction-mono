import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const IssuanceContent = dynamic(
  () => import("../../../../routes/main/Transaction/issuance"),
  {
    loading: () => <CircularProgress />,
  }
);

const Issuances = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Transaction Issuance/Expense</title>
    </Head>
    <AccessManager roles={["ROLE_INVENTORY_ISSUANCE_EXPENSE", "ROLE_ADMIN"]}>
      <IssuanceContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Issuances;
