import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";
import { useRouter } from "next/router";

const AssetContentDetails = dynamic(
  () => import("../../../routes/assets/assetDetails"),
  {
    loading: () => <CircularProgress />,
  }
);


const AssetDetails = ({ account }) => {
  const router = useRouter();
  const assetId = router.query.id;
  return (
    <React.Fragment>
      <Head>
        <title>Construction IMS Assets Details</title>
      </Head>
      <AccessManager roles={["ROLE_ASSETS", "ROLE_ADMIN"]}>
        <AssetContentDetails account={account} id={assetId} />
      </AccessManager>
    </React.Fragment>
  );
};

export default AssetDetails;
