import React from "react";
import { Inventory } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { requiredField } from "@/utility/helper";
import { FormInputNumber } from "@/components/common";
import { UPSERT_CRITICAL_LEVEL_INVENTORY } from "@/graphql/inventory/inventory-queries";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Inventory | null | undefined;
}

export default function UpsertCriticalQty(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;
  const [form] = Form.useForm();

  // ===================== Queries ==============================
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_CRITICAL_LEVEL_INVENTORY,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.updateReOrderQty?.id) {
          hide("Critical Level successfully updated");
        } else {
          message.error("Something went wrong. Please contact administrator.");
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
    upsertRecord({
      variables: {
        value: payload.reOrderQty,
        id: record?.id,
      },
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`Update Critical Level`}</Space>
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
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInputNumber
              name="reOrderQty"
              rules={requiredField}
              label="Critical Level Qty (UoU)"
              propsinputnumber={{
                placeholder: "Critical Level Qty (UoU)",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
