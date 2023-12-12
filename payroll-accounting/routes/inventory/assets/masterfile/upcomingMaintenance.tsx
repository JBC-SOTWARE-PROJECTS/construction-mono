import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import AssetPreventiveMaintenanceTable from "@/components/inventory/assets/masterfile/assetPreventiveMaintenanceTable";
import { Input, Button, message, Row, Col, Select, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDialog } from "@/hooks";
import UpsertPreventiveMaintenanceModal from "@/components/inventory/assets/dialogs/upsertPreventiveMaintenanceModal";
import useGetPreventiveByAsset from "@/hooks/asset/useGetPreventiveByAsset";
import { useRouter } from "next/router";
import { AssetPreventiveMaintenance, AssetUpcomingPreventiveMaintenance } from "@/graphql/gql/graphql";
import useGetUpcomingPreventive from "@/hooks/asset/useGetUpcomingPreventive";
import AssetUpcomingPreventiveMaintenanceTable from "@/components/inventory/assets/masterfile/assetUpcomingPreventiveMaintenanceTable";

type Props = {};
const { Search } = Input;

export interface IUMState {
  filter: string;
  page: number;
  size: number;
}

const initialState: IUMState = {
  filter: "",
  page: 0,
  size: 10,
};

export default function UpcomingMaintenance({}: Props) {
  const modal = useDialog(UpsertPreventiveMaintenanceModal);
  const router = useRouter();
  const [state, setState] = useState(initialState);

  const [preventives, loadingAsset, refetch] = useGetUpcomingPreventive({
    variables: {
      ...state
    },
    fetchPolicy: "network-only",
  });


  

  return (
    <>
      <ProCard
        title={`Upcoming Maintenance`}
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
          </ProFormGroup>
        }
      >
        <AssetUpcomingPreventiveMaintenanceTable
          dataSource={preventives?.content as AssetUpcomingPreventiveMaintenance[]}
          loading={false}
          totalElements={preventives?.totalElements as number}
          handleOpen={(record) => {}}
          handleAssign={(record) => {}}
          handleSupplier={(record) => {}}
          changePage={(page) => {
            setState((prev) => ({ ...prev, page: page }));
          }}
        />
      </ProCard>
    </>
  );
}
