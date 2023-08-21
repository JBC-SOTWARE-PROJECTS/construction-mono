import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const PositionComponent = asyncComponent(
  () => import("@/routes/administrative/offices")
);

const PositionPage = () => {
  return <PositionComponent />;
};

export default PositionPage;
