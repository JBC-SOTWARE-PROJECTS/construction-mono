import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import { Tabs, TabsProps } from "antd";
import UpcomingMaintenanceKms from "@/routes/inventory/assets/masterfile/upcomingMaintenanceKms";

const UpcomingMaintenanceComponent = asyncComponent(
  () => import("@/routes/inventory/assets/masterfile/upcomingMaintenance")
);

const AssetPage = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Date Schedules",
      children:  <UpcomingMaintenanceComponent />,
    },
    {
      key: "2",
      label: "By Kilometers",
      children:  <UpcomingMaintenanceKms />,
    }
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  return   <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  
 ;
};

export default AssetPage;
