import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const OfficeContent = dynamic(() => import("../../../routes/admin/Offices"), {
  loading: () => <CircularProgress />,
});

const Offices = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Offices</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN"]}>
      <div className="gx-main-content-wrapper-full-width">
        <OfficeContent account={account} />
      </div>
    </AccessManager>
  </React.Fragment>
);

export default Offices;
