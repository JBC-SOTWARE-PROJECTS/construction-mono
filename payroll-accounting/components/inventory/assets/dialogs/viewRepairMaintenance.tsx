import React from "react";
import {
  Button,
  Col,
  Row,
  Space,
  Input,
  Table,
  Modal,
  Typography,
  Pagination,
  Tag,
  Select,
  Divider,
} from "antd";
import { AssetRepairMaintenance } from "@/graphql/gql/graphql";
import RepairMaintenanceDetails from "../displays/RepairMaintenanceDetails";
import AssetRepairMaintenanceItemTable from "../masterfile/assetRepairMaintenanceItem";
import AssetRepairMaintenanceItemsComponent from "@/routes/inventory/assets/asset/repairMaintenanceItems";

interface IProps {
  hide: (hideProps: any) => void;
  record?: AssetRepairMaintenance | null | undefined;
}

export default function ViewRepairMaintenance(props: IProps) {
  const { hide, record } = props;

  return (
    <Modal
      title={"Repair/Maintenance Detail"}
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"90%"}
      style={{ maxWidth: "1600px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            loading={false}
            onClick={() => hide(false)}
            //disabled={_.isEmpty(selectedItems) || _.isEmpty(office)}
            //icon={<SendOutlined />}
          >
            Close
          </Button>
        </Space>
      }
    >
      <>
        <RepairMaintenanceDetails data={record} loading={false} />
        <Divider />
       <AssetRepairMaintenanceItemsComponent rmId={record?.id}/>
      </>
    </Modal>
  );
}
