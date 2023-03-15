import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const EmployeeForm = dynamic(
  () => import("../../../../routes/admin/Employees/EmployeeForm"),
  {
    loading: () => <CircularProgress />,
  }
);

const ManageEmployees = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Manage - Construction IMS Employees</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN"]}>
      <EmployeeForm account={account} id={null} />
    </AccessManager>
  </React.Fragment>
);

export default ManageEmployees;
