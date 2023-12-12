import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const UpcomingMaintenanceComponent = asyncComponent(
  () => import("@/routes/inventory/assets/masterfile/upcomingMaintenance")
);

const AssetPage = () => {
  return <UpcomingMaintenanceComponent />;
};

export default AssetPage;
