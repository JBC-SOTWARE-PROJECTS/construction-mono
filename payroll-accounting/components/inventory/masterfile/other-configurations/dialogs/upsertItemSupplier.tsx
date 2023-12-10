import React from "react";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import _ from "lodash";
import {
  GET_AVTIVE_ITEM,
  UPSERT_RECORD_ITEM_BY_SUPPLIER,
} from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormDebounceSelect, FormInputNumber } from "@/components/common";

interface IProps {
  hide: (hideProps: any) => void;
  id: string;
}

export default function UpsertItemSupplierModal(props: IProps) {
  const { hide, id } = props;
  const [form] = Form.useForm();
  // ===================== Queries ==============================
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_ITEM_BY_SUPPLIER,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertSupplierItem?.id)) {
          hide("Item successfully assigned");
        } else {
          message.error("Item already assigned");
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (data: any) => {
    let payload = _.clone(data);
    payload.supplier = { id: id };
    payload.item = { id: data?.item };
    console.log("payload", payload);

    upsertRecord({
      variables: {
        fields: payload,
        itemId: data?.item,
        supId: id,
        id: null,
      },
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`Assign Item Supplier`}</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "500px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertForm"
            loading={upsertLoading}
            icon={<SaveOutlined />}>
            {`Save & Close`}
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormDebounceSelect
              label="Select Item"
              name="item"
              rules={requiredField}
              propsselect={{
                allowClear: true,
                placeholder: "Select Item",
                fetchOptions: GET_AVTIVE_ITEM,
                onChange: (newValue) => {
                  form.setFieldValue("item", newValue?.value);
                },
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              name="cost"
              rules={requiredField}
              label="Unit Cost (UoU)"
              propsinputnumber={{
                placeholder: "Unit Cost (UoU)",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
