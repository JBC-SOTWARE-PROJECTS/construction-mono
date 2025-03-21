import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import AccessManager from "@/components/accessControl/AccessManager";
import CircularProgress from "@/components/circularProgress";
import { IPageProps } from "@/utility/interfaces";

const Component = dynamic(
  () => import("@/routes/payroll/payroll-management/p-allowance"),
  {
    loading: () => <CircularProgress />,
  }
);

const PayrollAllowance = ({ account }: IPageProps) => (
  <React.Fragment>
    <Head>
      <title>Payroll Management</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "PAYROLL_MANAGER"]}>
      <div className="gx-main-content-wrapper-full-width">
        <Component account={account} />
      </div>
    </AccessManager>
  </React.Fragment>
);

export default PayrollAllowance;
