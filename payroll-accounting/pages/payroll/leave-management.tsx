import AccessManager from "@/components/accessControl/AccessManager";
import CircularProgress from "@/components/circularProgress";
import { IPageProps } from "@/utility/interfaces";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
const Component = dynamic(() => import("@/routes/payroll/leave-management"), {
  loading: () => <CircularProgress />,
});
function LeaveManagementPage({ account }: IPageProps) {
  return (
    <React.Fragment>
      <Head>
        <title>Payroll Management</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN"]}>
        <div className="gx-main-content-wrapper-full-width">
          <Component account={account} />
        </div>
      </AccessManager>
    </React.Fragment>
  );
}

export default LeaveManagementPage;
