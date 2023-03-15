import React from "react";
import { Tabs } from "antd";
import ItemGroups from "./itemgroups";
import ItemCategory from "./itemcategory";
import UnitMeasurements from "./unitmeasurements";
import Generics from "./generics";
import SupplierType from "./suppliertype";
import PaymentTerms from "./paymentTerms";
import { useLocalStorage } from "../../../../util/customhooks";
import DeliveryType from "./deliveryType";
import AdjustmentType from "./adjustmentType";
import PettyCashType from "./pettyType";
import RepairType from "./repairTypes";
import Insurances from "./insurances";
import ServiceCategory from "./serviceCategory";
import JobStatus from "./jobStatus";

const TabPane = Tabs.TabPane;

const OtherContent = ({ account }) => {
  const [active, setActive] = useLocalStorage("otherTab", "itemgroup");

  const callback = (e) => {
    setActive(e);
  };

  return (
    <Tabs
      onChange={callback}
      type="card"
      destroyInactiveTabPane={true}
      activeKey={active}
    >
      <TabPane tab="Item Groups" key="itemgroup">
        <ItemGroups account={account} />
      </TabPane>
      <TabPane tab="Item Category" key="itemcategory">
        <ItemCategory account={account} />
      </TabPane>
      <TabPane tab="Unit Measurements" key="unitmeasurement">
        <UnitMeasurements account={account} />
      </TabPane>
      <TabPane tab="Generics" key="generics">
        <Generics account={account} />
      </TabPane>
      <TabPane tab="Supplier Types" key="suppliertypes">
        <SupplierType account={account} />
      </TabPane>
      <TabPane tab="Payment Terms" key="paymentterms">
        <PaymentTerms account={account} />
      </TabPane>
      <TabPane tab="Delivery Type" key="deliveryType">
        <DeliveryType account={account} />
      </TabPane>
      <TabPane tab="Quantity Adjustment Type" key="quantityAdjustmentType">
        <AdjustmentType account={account} />
      </TabPane>
      <TabPane tab="Cash Transaction Type" key="pettycashType">
        <PettyCashType account={account} />
      </TabPane>
      {/* <TabPane tab="Repair Type" key="repairType">
        <RepairType account={account} />
      </TabPane>
      <TabPane tab="Insurances" key="insurance">
        <Insurances account={account} />
      </TabPane> */}
      {/* <TabPane tab="Service Category" key="serviceCategory">
        <ServiceCategory account={account} />
      </TabPane> */}
      <TabPane tab="Project Status" key="jobStatus">
        <JobStatus account={account} />
      </TabPane>
    </Tabs>
  );
};

export default OtherContent;
