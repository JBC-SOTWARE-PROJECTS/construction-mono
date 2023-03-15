import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const OTCContent = dynamic(() => import("../../../routes/billing/otc"), {
  loading: () => <CircularProgress />,
});

const OverTheCounter = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS OTC Accounts</title>
    </Head>
    <AccessManager roles={["ROLE_BILLING", "ROLE_ADMIN"]}>
      <OTCContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default OverTheCounter;
