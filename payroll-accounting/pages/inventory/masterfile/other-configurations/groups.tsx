import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ItemGroupsComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/other-configurations/groups")
);

const ItemGroupPage = () => {
  return <ItemGroupsComponent />;
};

export default ItemGroupPage;
