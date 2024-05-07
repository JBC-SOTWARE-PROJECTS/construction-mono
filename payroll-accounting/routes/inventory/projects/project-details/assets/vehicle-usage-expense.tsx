import React from 'react'
import { Tabs } from "antd";
import VEHRentalExpense from './rental-expense';
import VEHLaborExpense from './labor-expense';
import VEHRepairExpense from './repair-expense';

type Props = {}
const configItems = [
    {
      label: `Rentals`,
      key: "1",
      children: <VEHRentalExpense/>,
    },
    {
        label: `Labor`,
        key: "2",
        children: <VEHLaborExpense/>,
    },
    {
        label: `Repairs`,
        key: "3",
        children: <VEHRepairExpense/>,
    }
  ]

function VehicleUsageProjectExpense({}: Props) {
  return (
    <div>
    <Tabs
      tabPosition={"left"}
      items={configItems}
    />
  </div>
  )
}

export default VehicleUsageProjectExpense