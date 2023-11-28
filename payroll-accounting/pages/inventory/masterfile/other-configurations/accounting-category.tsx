import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ItemComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/items")
);

const ItemGroupPage = () => {
  return <ItemComponent type="all" />;
};

export default ItemGroupPage;
