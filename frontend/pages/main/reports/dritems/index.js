import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const DReportItemsContent = dynamic(
  () => import("../../../../routes/main/Reports/dritems"),
  {
    loading: () => <CircularProgress />,
  }
);

const DReportItem = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Reports Delivery Receiving Items</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_REPORTS"]}>
      <DReportItemsContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default DReportItem;
