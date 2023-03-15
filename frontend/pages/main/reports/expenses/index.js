import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const ExpenseContent = dynamic(
  () => import("../../../../routes/main/Reports/expense"),
  {
    loading: () => <CircularProgress />,
  }
);

const Expense = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Reports Expense Items</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_REPORTS"]}>
      <ExpenseContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Expense;
