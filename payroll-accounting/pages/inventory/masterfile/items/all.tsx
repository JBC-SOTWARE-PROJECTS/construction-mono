import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ItemComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/items")
);

const ItemPage = () => {
  return <ItemComponent type="all" />;
};

export default ItemPage;
