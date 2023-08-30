import React from "react";
import CircularProgress from "@/components/circularProgress";
import dynamic from "next/dynamic";

const ContributionManagement = dynamic(
  () => import("@/routes/payroll/configurations/contribution-management"),
  {
    loading: () => <CircularProgress />,
  }
);

const ContributionManagementPage = () => {
  return (
    <>
      <ContributionManagement />
    </>
  );
};

export default ContributionManagementPage;
