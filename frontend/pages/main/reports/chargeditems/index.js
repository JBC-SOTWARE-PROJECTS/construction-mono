import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const ChargeItemsContent = dynamic(
  () => import("../../../../routes/main/Reports/chargeitems"),
  {
    loading: () => <CircularProgress />,
  }
);

const ChargeItem = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Reports Charged Items</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_REPORTS"]}>
      <ChargeItemsContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default ChargeItem;
