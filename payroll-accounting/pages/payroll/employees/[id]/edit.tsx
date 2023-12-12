import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import CircularProgress from "@/components/circularProgress";
import AccessManager from "@/components/accessControl/AccessManager";
import { IPageProps } from "@/utility/interfaces";

const EmployeeForm = dynamic(
  () => import("@/routes/payroll/employees/EmployeeForm"),
  {
    loading: () => <CircularProgress />,
  }
);

const ManageEmployee = ({ account }: IPageProps) => {
  const router = useRouter();

  return (
    <React.Fragment>
      <Head>
        <title>Manage - Construction IMS Employees</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN"]}>
        <EmployeeForm account={account} />
      </AccessManager>
    </React.Fragment>
  );
};

export default ManageEmployee;
