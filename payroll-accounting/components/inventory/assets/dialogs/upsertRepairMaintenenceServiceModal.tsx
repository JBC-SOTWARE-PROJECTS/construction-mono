import { AssetRepairMaintenanceItems, RepairMaintenanceItemType } from "@/graphql/gql/graphql";
import React from "react";
import { Button, Space, Modal, Divider, Form, Row, Col } from "antd";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";
import { requiredField } from "@/utility/helper";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import {
  UPSERT_MP_REPAIR_MAINTENANCE_ITEM_RECORD
} from "@/graphql/assets/queries";
import { useMutation } from "@apollo/client";
import {  App } from "antd";
import { SaveOutlined } from "@ant-design/icons";

interface IProps {
  hide: (hideProps: any) => void;
  record?: AssetRepairMaintenanceItems | null | undefined;
  rmId?: string | null;
}
export default function UpsertRepairMaintenenceServiceModal(props: IProps) {
  const { hide, record , rmId} = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const { message } = App.useApp();

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_MP_REPAIR_MAINTENANCE_ITEM_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data)
          message.success("Items successfully added");
        }
      },
    }
  );

  const onSubmit = (values: any) => {
    let initialPayload = {
      id: null,
      quantity: 1,
      assetRepairMaintenance: rmId,
      item: null,
      itemType: "SERVICE" as RepairMaintenanceItemType
    }
    let payload : any = [{
      ...initialPayload,
      ...values,
    }];


    showPasswordConfirmation(() => {
      upsert({
        variables: {
          items: payload
        },
      });
    });
  };

  return (
    <Modal
      title={"Repair/Maintenance Service"}
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"50%"}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertRepairMaintenanceService"
            loading={upsertLoading}
            icon={<SaveOutlined />}
          >
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }
    >
      <>
        <Form
          name="upsertRepairMaintenanceService"
          layout="vertical"
          onFinish={onSubmit}
          //  onFinishFailed={onFinishFailed}
          initialValues={{
            ...record,
          }}
        >
          <Row gutter={[8, 0]}>
          <Col span={12}>
              <FormInput
                name="description"
                rules={requiredField}
                label="Description"
                propsinput={{
                  placeholder: "Description",
                }}
              />
            </Col>
            <Col span={12}>
              <FormInput
                name="basePrice"
                label="Amount"
                rules={requiredField}
                propsinput={{
                  placeholder: "Enter amount",
                  type: "number"
                }}
              />
            </Col>
          </Row>
        </Form>
      </>
    </Modal>
  );
}
