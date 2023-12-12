import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const ItemSubAccountComponent = asyncComponent(
  () =>
    import(
      "@/routes/inventory/masterfile/other-configurations/subaccount-category"
    )
);

const ItemSubAccountPage = () => {
  return <ItemSubAccountComponent />;
};

export default ItemSubAccountPage;
