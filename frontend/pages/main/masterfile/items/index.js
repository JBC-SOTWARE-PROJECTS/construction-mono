import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const ItemContent = dynamic(
  () => import("../../../../routes/main/Masterfile/items"),
  {
    loading: () => <CircularProgress />,
  }
);

const Item = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Item Masterfile</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_MASTERFILE"]}>
      <ItemContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Item;
