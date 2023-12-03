import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ItemCategoriesComponent = asyncComponent(
  () => import("@/routes/inventory/masterfile/other-configurations/category")
);

const ItemCategoryPage = () => {
  return <ItemCategoriesComponent />;
};

export default ItemCategoryPage;
