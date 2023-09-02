import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import CircularProgress from "@/components/circularProgress";
import dynamic from "next/dynamic";

const SalaryRateConfiguration = dynamic(
  () => import("@/routes/payroll/configurations/salary-rate-config"),
  {
    loading: () => <CircularProgress />,
  }
);

const ConfigurationsPage = () => {
  return (
    <>
      <SalaryRateConfiguration />
    </>
  );
};

export default ConfigurationsPage;
