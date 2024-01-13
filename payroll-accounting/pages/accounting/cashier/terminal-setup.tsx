import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const TerminalSetupComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/terminals")
);

const TerminalSetup = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Cashier Terminal</title>
      </Head>
      <AccessManager roles={["ROLE_CASHIER", "ROLE_CASHIER"]}>
        <div className="w-full">
          <TerminalSetupComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default TerminalSetup;
