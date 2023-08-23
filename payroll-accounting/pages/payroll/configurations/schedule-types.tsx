import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import AccessManager from "@/components/accessControl/AccessManager";
import CircularProgress from "@/components/circularProgress";
import { IPageProps } from "@/utility/interfaces";

const ScheduleTypesPage = dynamic(
  () => import("@/routes/payroll/configurations/schedule-types"),
  {
    loading: () => <CircularProgress />,
  }
);

const Employees = ({ account }: IPageProps) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Employees</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "MANAGE_SCHEDULE_TYPES"]}>
      <div className="gx-main-content-wrapper-full-width">
        <ScheduleTypesPage account={account} />
      </div>
    </AccessManager>
  </React.Fragment>
);

export default Employees;
