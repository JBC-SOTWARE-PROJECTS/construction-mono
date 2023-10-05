import CircularProgress from "@/components/circularProgress";
import dynamic from "next/dynamic";
import React from "react";

const AllowancePackageManagement = dynamic(
  () => import("@/routes/payroll/allowance-management/allowance-package"),
  {
    loading: () => <CircularProgress />,
  }
);

function AllowancePackage() {
  return (
    <div>
      <AllowancePackageManagement />
    </div>
  );
}

export default AllowancePackage;
