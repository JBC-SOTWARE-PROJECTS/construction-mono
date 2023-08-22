import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const SalaryRateConfiguration = asyncComponent(
  () => import("@/routes/configuration/config-index")
);

const ConfigurationsPage = () => {
  return (
    <>
      <SalaryRateConfiguration />
    </>
  );
};

export default ConfigurationsPage;
