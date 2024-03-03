import React, { useState } from "react";
import {
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDialog } from "@/hooks";
import { useRouter } from "next/router";
import {AssetRepairMaintenance,} from "@/graphql/gql/graphql";
import AssetRepairMaintenanceTable from "@/components/inventory/assets/masterfile/assetRepairMaintenance";
import useGetAssetRepairMaintenance from "@/hooks/asset/useGetAssetRepairMaintenance";
import UpsertRepairMaintenanceModal from "@/components/inventory/assets/dialogs/upsertAssetRepairMaintenance";
import ViewRepairMaintenance from "@/components/inventory/assets/dialogs/viewRepairMaintenance";
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

export default function AssetRepairMaintenanceComponent({}: Props) {
  const modalUpsert = useDialog(UpsertRepairMaintenanceModal);
  const modalViewRM = useDialog(ViewRepairMaintenance);
  const router = useRouter();
  const [state, setState] = useState(initialState);

  const [data, loading, refetch] = useGetAssetRepairMaintenance({
    variables: {
      ...state,
      // id: router?.query?.id,
    },
    fetchPolicy: "network-only",
  });

  const onUpsertRecord = (record?: any) => {
    modalUpsert({ record: record }, (result: any) => {
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

  const viewRepairMaintenance = (record?: any) => {
    modalViewRM({ record: record });
  };

  return (
    <>
      <ProCard
        title={`All Repairs and Maintenance`}
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
              allowedPermissions={["manage_repairs_and_maintenance"]}
            >
              Create New
            </CustomButton>
          </ProFormGroup>
        }
      >
        <AssetRepairMaintenanceTable
          dataSource={data?.content as AssetRepairMaintenance[]}
          loading={false}
          totalElements={data?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleView={(record) => viewRepairMaintenance(record)}
          handleSupplier={(record) => {}}
          changePage={(page) => {
            setState((prev) => ({ ...prev, page: page }));
          }}
        />
      </ProCard>
    </>
  );
}
