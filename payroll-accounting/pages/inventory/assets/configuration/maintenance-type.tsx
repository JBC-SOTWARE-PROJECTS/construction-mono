import React from 'react'
import asyncComponent from "@/utility/asyncComponent";

type Props = {}

const MaintenanceTypeComponent = asyncComponent(
    () => import("@/routes/inventory/assets/configuration/MaintenanceTypeConfig")
  );

export default function MaintenanceTypeConfigPage({}: Props) {
  return (
    <MaintenanceTypeComponent/>
  )
}