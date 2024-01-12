import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const InventoryContent = asyncComponent(
  () => import("@/routes/inventory/monitoring")
);

const InventoryMonitoringPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Inventory Monitoring</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY"]}>
        <div className="w-full">
          <InventoryContent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default InventoryMonitoringPage;
