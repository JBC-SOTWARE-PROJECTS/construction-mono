import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ItemGenericsComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/other-configurations/generics")
);

const ItemGenericsPage = () => {
  return <ItemGenericsComponent />;
};

export default ItemGenericsPage;
