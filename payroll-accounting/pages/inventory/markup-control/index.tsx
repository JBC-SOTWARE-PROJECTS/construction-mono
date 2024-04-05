import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import AccessManager from "@/components/accessControl/AccessManager";

const Component = asyncComponent(
  () => import("@/routes/inventory/markup-control")
);

const MarkupControl = () => {
  return (
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY"]}>
      <Component />
    </AccessManager>
  );
};

export default MarkupControl;
