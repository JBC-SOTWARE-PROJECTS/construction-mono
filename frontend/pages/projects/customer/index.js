import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const CustomerContent = dynamic(
  () => import("../../../routes/billing/customer"),
  {
    loading: () => <CircularProgress />,
  }
);

const Customer = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Customer List</title>
    </Head>
    <AccessManager roles={["ROLE_BILLING", "ROLE_ADMIN"]}>
      <CustomerContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Customer;
