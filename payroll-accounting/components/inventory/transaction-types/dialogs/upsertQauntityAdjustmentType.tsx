import React from "react";
import { QuantityAdjustmentType } from "@/graphql/gql/graphql";
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
import { UPSERT_RECORD_QUANTITY_ADJUSTMENT } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";
import { SOURCE_CLOUMN } from "@/utility/constant";

interface IProps {
  hide: (hideProps: any) => void;
  record?: QuantityAdjustmentType | null | undefined;
}

export default function UpsertQuantityAdjustmentTypeModal(props: IProps) {
  const { hide, record } = props;
  // ===================== Queries ==============================
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_QUANTITY_ADJUSTMENT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertQuantityAdjustmentType) {
          hide(data?.upsertQuantityAdjustmentType);
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
          } Quantity Adjustment Type`}</Space>
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
          is_active: record?.is_active ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="code"
              rules={requiredField}
              label=" Quantity Adjustment Type Code"
              propsinput={{
                placeholder: " Quantity Adjustment Type Code",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="description"
              rules={requiredField}
              label=" Quantity Adjustment Type Description"
              propsinput={{
                placeholder: " Quantity Adjustment Type Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="flagValue"
              rules={requiredField}
              label=" Quantity Adjustment Type Flag Value"
              propsinput={{
                placeholder: " Quantity Adjustment Type Flag Value",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              name="sourceColumn"
              label="Source Column"
              rules={requiredField}
              propsselect={{
                options: SOURCE_CLOUMN,
                allowClear: true,
                placeholder: "Select Source Column",
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="is_active"
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
