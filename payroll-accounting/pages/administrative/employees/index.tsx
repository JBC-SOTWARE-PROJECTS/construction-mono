import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import AccessManager from "@/components/accessControl/AccessManager";
import { IPageProps } from "@/utility/interfaces";
import asyncComponent from "@/utility/asyncComponent";

const Employee = asyncComponent(
  () => import("@/routes/administrative/Employees")
);

const Employees = ({ account }: IPageProps) => (
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
