import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const OfficeComponent = asyncComponent(
  () => import("@/routes/administrative/offices")
);

const OfficePage = () => {
  return <OfficeComponent />;
};

export default OfficePage;
