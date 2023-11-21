import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Select, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import MaintenanceTypeTable from "@/components/inventory/assets/masterfile/maintenanceTypeTable";
import { useDialog } from "@/hooks";
import UpsertMaintenanceTypeModal from "@/components/inventory/assets/dialogs/upsertMaintenanceTypeModal";
import useGetAssetMaintenanceType from "@/hooks/asset/useGetAssetMaintenanceType";
import { AssetMaintenanceTypes } from "@/graphql/gql/graphql";

type Props = {};
const { Search } = Input;

export interface IAssetMaintenanceTypeState {
  filter: string;
  page: number;
  size: number;
}

const initialState: IAssetMaintenanceTypeState = {
  filter: "",
  page: 0,
  size: 10
};


export default function MaintenanceTypeConfigComponent({}: Props) {
  const modal = useDialog(UpsertMaintenanceTypeModal);
  const [state, setState] = useState(initialState);
  let title = "All Maintenance Type";

  const [data, loading, refetch] = useGetAssetMaintenanceType({
    variables: state,
    fetchPolicy: "network-only",
  });


  const onUpsertRecord = (record?: any) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        refetch();
        if (record?.id) {
          message.success("Item successfully updated");
        } else {
          message.success("Item successfully added");
        }
      }
    });
  };

  return (
    <>
      <PageContainer
        title="Asset Maintenance Type"
        content="Mastering Your Asset Maintenance Type: Configuration and Optimization of Asset Maintenance Types."
      >
        <ProCard
          title={`${title} List`}
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
          <MaintenanceTypeTable
            dataSource={data?.content as AssetMaintenanceTypes[]}
            loading={false}
            totalElements={0 as number}
            handleOpen={(record) => onUpsertRecord(record)}
            handleAssign={(record) => {}}
            handleSupplier={(record) => {}}
            changePage={(page) => {
             setState((prev) => ({ ...prev, page: page }));
            }}
          />
        </ProCard>
      </PageContainer>
    </>
  );
}
