import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const CompanyContent = dynamic(
  () => import("../../../../routes/admin/Company"),
  {
    loading: () => <CircularProgress />,
  }
);

const Company = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Company Settings</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN"]}>
      <CompanyContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Company;
