import { Tabs } from "antd";
import React from "react";
import RentalRates from "./rentalRates";

type Props = {};

const AssetConfigurations = (props: Props) => {

  const configItems = [
    {
      label: `Rental Rates`,
      key: "1",
      children: <RentalRates/>,
    }
  ]
  return (
    <div>
      <Tabs
        tabPosition={"left"}
        items={configItems}
      />
    </div>
  );
};

export default AssetConfigurations;
