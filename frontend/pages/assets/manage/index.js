import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const AssetContent = dynamic(() => import("../../../routes/assets/assets"), {
  loading: () => <CircularProgress />,
});

const Assets = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Asset List</title>
    </Head>
    <AccessManager roles={["ROLE_ASSETS", "ROLE_ADMIN"]}>
      <AssetContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Assets;
