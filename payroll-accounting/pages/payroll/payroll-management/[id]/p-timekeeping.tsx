import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import AccessManager from "@/components/accessControl/AccessManager";
import CircularProgress from "@/components/circularProgress";
import { IPageProps } from "@/utility/interfaces";

const Component = dynamic(
  () => import("@/routes/payroll/payroll-management/p-timekeeping"),
  {
    loading: () => <CircularProgress />,
  }
);

const PayrollTimekeeping = ({ account }: IPageProps) => (
  <React.Fragment>
    <Head>
      <title>Payroll Management</title>
    </Head>
    <AccessManager
      roles={["ROLE_ADMIN", "PAYROLL_MANAGER", "TIMEKEEPING_USER"]}
    >
      <div className="gx-main-content-wrapper-full-width">
        <Component account={account} />
      </div>
    </AccessManager>
  </React.Fragment>
);

export default PayrollTimekeeping;
