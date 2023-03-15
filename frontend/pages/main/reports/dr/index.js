import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const DReportContent = dynamic(
  () => import("../../../../routes/main/Reports/dr"),
  {
    loading: () => <CircularProgress />,
  }
);

const DReport = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Reports Delivery Receiving</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_REPORTS"]}>
      <DReportContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default DReport;
