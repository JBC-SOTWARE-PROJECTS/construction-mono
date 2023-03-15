import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const Employee = dynamic(() => import("../../../routes/admin/Employees"), {
  loading: () => <CircularProgress />,
});

const Employees = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Employees</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN"]}>
      <div className="gx-main-content-wrapper-full-width">
        <Employee account={account} />
      </div>
    </AccessManager>
  </React.Fragment>
);

export default Employees;
