import CircularProgress from "@/components/circularProgress";
import dynamic from "next/dynamic";
import React from "react";

const AllowanceManagement = dynamic(
  () => import("@/routes/payroll/allowance-management/allowance-type"),
  {
    loading: () => <CircularProgress />,
  }
);

function AllowanceType() {
  return (
    <div>
      <AllowanceManagement />
    </div>
  );
}

export default AllowanceType;
