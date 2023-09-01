import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const TerminalSetupComponent = asyncComponent(
  () => import("@/routes/accounting/cashier/accounts")
);

const TerminalSetup = () => {
  return <TerminalSetupComponent />;
};

export default TerminalSetup;
