import React, { useState } from "react";
import {
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDialog } from "@/hooks";
import { useRouter } from "next/router";
import {AssetRepairMaintenance, VehicleUsageMonitoring,} from "@/graphql/gql/graphql";
import AssetRepairMaintenanceTable from "@/components/inventory/assets/masterfile/assetRepairMaintenance";
import useGetAssetRepairMaintenance from "@/hooks/asset/useGetAssetRepairMaintenance";
import UpsertRepairMaintenanceModal from "@/components/inventory/assets/dialogs/upsertAssetRepairMaintenance";
import ViewRepairMaintenance from "@/components/inventory/assets/dialogs/viewRepairMaintenance";
import VehicleUsageMonitoringTable from "@/components/inventory/assets/masterfile/vehicleUsageMonitoring";
import useGetVehicleUsageMonitoring from "@/hooks/asset/useGetVehicleUsageMonitoring";
import UpsertVehicleUsageModal from "@/components/inventory/assets/dialogs/upsertVehicleUsage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ACTIVE_PROJECTS } from "@/components/payroll/configurations/UpsertScheduleType";

type Props = {};
const { Search } = Input;

export interface IPMState {
  filter: string;
  page: number;
  size: number;
}

const initialState: IPMState = {
  filter: "",
  page: 0,
  size: 10,
};

export default function VehicleUsageMonitoringComponent({}: Props) {
  const modalUpsert = useDialog(UpsertVehicleUsageModal);
  //const modalViewRM = useDialog(ViewRepairMaintenance);
  const router = useRouter();
  const [state, setState] = useState(initialState);

  const [data, loading, refetch] = useGetVehicleUsageMonitoring({
    variables: {
      ...state,
       asset: router?.query?.id,
    },
    fetchPolicy: "network-only",
  });
 
  const {
    loading: loadingProjects,
    error,
    data: projects,
  } = useQuery(GET_ACTIVE_PROJECTS);

  const onUpsertRecord = (record?: any) => {

   var projectOpts = [
      { value: null, label: "Office Based" },
      ...(projects
        ? projects?.list?.map((item: any) => ({
            value: item.id,
            label: item.description,
          }))
        : []),
    ]

    modalUpsert({ record: record , projectOpts: projectOpts}, (result: any) => {
      if (result) {
        refetch();
        if (record?.id) {
          message.success("Item successfully added");
        } else {
          message.success("Item successfully updated");
        }
      }
    });
  };

  // const viewRepairMaintenance = (record?: any) => {
  //   modalViewRM({ record: record });
  // };

  return (
    <>
      <ProCard
        title={`All Vehicle Usage`}
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}
            >
              Create New
            </Button>
          </ProFormGroup>
        }
      >
        <VehicleUsageMonitoringTable
          dataSource={data?.content}
          loading={false}
          totalElements={data?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleView={(record) => {}}
          handleSupplier={(record) => {}}
          changePage={(page) => {
            setState((prev) => ({ ...prev, page: page }));
          }}
        />
      </ProCard>
    </>
  );
}
