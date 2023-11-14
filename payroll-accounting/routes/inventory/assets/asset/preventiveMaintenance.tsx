import React from "react";
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

type Props = {};
const { Search } = Input;

export default function PreventiveMaintenance({}: Props) {
    const modal = useDialog(UpsertPreventiveMaintenanceModal);
  
    const onUpsertRecord = (record?: any) => {
        modal({ record: record }, (result: any) => {
          if (result) {
            //refetch();
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
        title={``}
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
                //onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
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
        <AssetPreventiveMaintenanceTable
          dataSource={[]}
          loading={false}
          totalElements={0 as number}
          handleOpen={(record) => {}}
          handleAssign={(record) => {}}
          handleSupplier={(record) => {}}
          changePage={(page) => {
            // setState((prev) => ({ ...prev, page: page }));
          }}
        />
      </ProCard>
    </>
  );
}
