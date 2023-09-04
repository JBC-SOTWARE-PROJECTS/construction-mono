import AccessManager from "@/components/accessControl/AccessManager";
import CircularProgress from "@/components/circularProgress";
import asyncComponent from "@/utility/asyncComponent";
import { IPageProps } from "@/utility/interfaces";
import Head from "next/head";
import React from "react";

const Component = asyncComponent(
  () => import("@/routes/payroll/attendance-management/upload-biometric")
);

const UploadBiometricData = ({ account }: IPageProps) => (
  <React.Fragment>
    <Head>
      <title>Attendance Mangement</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "MANAGE_SCHEDULE_TYPES"]}>
      <Component account={account} />
    </AccessManager>
  </React.Fragment>
);

export default UploadBiometricData;
