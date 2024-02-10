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
import { AssetPreventiveMaintenance } from "@/graphql/gql/graphql";
import CustomButton from "@/components/common/CustomButton";

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

export default function PreventiveMaintenance({}: Props) {
  const modal = useDialog(UpsertPreventiveMaintenanceModal);
  const router = useRouter();
  const [state, setState] = useState(initialState);

  const [preventives, loadingAsset, refetch] = useGetPreventiveByAsset({
    variables: {
      ...state,
      id: router?.query?.id,
    },
    fetchPolicy: "network-only",
  });

  const onUpsertRecord = (record?: any) => {
    modal({ record: record }, (result: any) => {
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

  return (
    <>
      <ProCard
        title={`All Preventive Maintenance`}
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
            <CustomButton
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}
              allowedPermissions={["manage_pms"]}
            >
              Create New
            </CustomButton>
          </ProFormGroup>
        }
      >
        <AssetPreventiveMaintenanceTable
          dataSource={preventives?.content as AssetPreventiveMaintenance[]}
          loading={false}
          totalElements={preventives?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
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
