import React from "react";
import { ProCard } from "@ant-design/pro-components";
import { PageHeader } from "@ant-design/pro-components";
import useGetAssetById from "@/hooks/asset/useGetAssetById";
import { useRouter } from "next/router";
import AssetDetails from "@/components/inventory/assets/displays/AssetDetails";
import { Tag } from "antd";
import { AssetStatusColor } from "@/utility/constant";
import { AssetStatus, AssetType } from "@/graphql/gql/graphql";
import { Divider, Tabs } from "antd";
import { TabsProps } from "antd/lib";
import PreventiveMaintenance from "./preventiveMaintenance";
import AssetRepairMaintenance from "./repairMaintenance";
import AssetRepairMaintenanceComponent from "./repairMaintenance";
import VehicleUsageMonitoringComponent from "./vehicleUsageMonitoring";
import AssetConfigurations from "./assetConfigurations";

type Props = {};
const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Preventive Maintenance",
    children: <PreventiveMaintenance/>,
  },
  {
    key: "2",
    label: "Repairs and Maintenance",
    children: <AssetRepairMaintenanceComponent/>,
  },
  {
    key: "3",
    label: "Vehicle Usage Monitoring",
    children: <VehicleUsageMonitoringComponent/>,
  },
  {
    key: "4",
    label: "Configurations",
    children: <AssetConfigurations/>,
  }
];

export default function AssetComponent({}: Props) {
  const router = useRouter();
  const [asset, loadingAsset] = useGetAssetById(router?.query?.id);

  var assetStatus = (asset?.status as AssetStatus) ?? "NO_STATUS";
  var assetType = asset?.type as AssetType;
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
      >
        <PageHeader
          title="Asset Management"
          extra={
            <>
              {assetType ? (
                <Tag color={"blue"}>{assetType.replace(/_/g, " ")} </Tag>
              ) : (
                <></>
              )}
              {assetStatus ? (
                <Tag color={AssetStatusColor[assetStatus]}>
                  {assetStatus.replace(/_/g, " ")}
                </Tag>
              ) : (
                <></>
              )}
            </>
          }
        >
          <AssetDetails asset={asset} loading={loadingAsset} />
        </PageHeader>
        <Divider />
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </ProCard>
    </>
  );
}
