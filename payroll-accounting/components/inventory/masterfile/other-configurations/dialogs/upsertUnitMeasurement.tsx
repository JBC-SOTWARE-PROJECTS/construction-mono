import React from "react";
import { UnitMeasurement } from "@/graphql/gql/graphql";
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
import { UPSERT_RECORD_ITEM_MEASUREMENT } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput } from "@/components/common";

interface IProps {
  hide: (hideProps: any) => void;
  record?: UnitMeasurement | null | undefined;
}

export default function UpsertUnitMeasurementModal(props: IProps) {
  const { hide, record } = props;
  // ===================== Queries ==============================
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_ITEM_MEASUREMENT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertUnitMeasurement) {
          hide(data?.upsertUnitMeasurement);
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    upsert({
      variables: {
        fields: values,
        id: record?.id,
      },
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Item Measurement`}</Space>
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
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
          isSmall: record?.isSmall ?? false,
          isBig: record?.isBig ?? false,
          isActive: record?.isActive ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="unitCode"
              rules={requiredField}
              label="Item Measurement Code"
              propsinput={{
                placeholder: "Item Measurement Code",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="unitDescription"
              rules={requiredField}
              label="Item Measurement Description"
              propsinput={{
                placeholder: "Item Measurement Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="isSmall"
              valuePropName="checked"
              checkBoxLabel="Set as Small Unit"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="isBig"
              valuePropName="checked"
              checkBoxLabel="Set as Big Unit"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="isActive"
              valuePropName="checked"
              checkBoxLabel="Set as Active"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
