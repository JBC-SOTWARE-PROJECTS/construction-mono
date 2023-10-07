import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const WTXComponent = asyncComponent(() => import("@/routes/accounting/accounts-payable/wtx"));

const WTX2307 = () => {
  return <WTXComponent />;
};

export default WTX2307;
