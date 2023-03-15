import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const StockCardContent = dynamic(
  () => import("../../../../routes/main/Reports/stockcard"),
  {
    loading: () => <CircularProgress />,
  }
);

const StockCard = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Reports Stock Card</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_REPORTS"]}>
      <StockCardContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default StockCard;
