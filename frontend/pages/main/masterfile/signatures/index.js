import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const SignatureContent = dynamic(
  () => import("../../../../routes/main/Masterfile/signatures"),
  {
    loading: () => <CircularProgress />,
  }
);

const Signatures = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Masterfile - Others</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_MASTERFILE"]}>
      <SignatureContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Signatures;
