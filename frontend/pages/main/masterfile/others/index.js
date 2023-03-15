import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const OthersContent = dynamic(
  () => import("../../../../routes/main/Masterfile/others"),
  {
    loading: () => <CircularProgress />,
  }
);

const Others = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Masterfile - Others</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_MASTERFILE"]}>
      <OthersContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Others;
