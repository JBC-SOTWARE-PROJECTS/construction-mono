import React from "react";
import { TransactionType } from "@/graphql/gql/graphql";
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
import { UPSERT_RECORD_TRANSACTION_TYPE } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput } from "@/components/common";

interface IProps {
  hide: (hideProps: any) => void;
  record?: TransactionType | null | undefined;
}

export default function UpsertTransactionTypeModal(props: IProps) {
  const { hide, record } = props;
  // ===================== Queries ==============================
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_TRANSACTION_TYPE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertTransType) {
          hide(data?.upsertTransType);
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    const payload = _.clone(values);
    payload.tag = record?.tag;
    upsert({
      variables: {
        fields: payload,
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
          } Transaction Type`}</Space>
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
          status: record?.status ?? false,
          fixAsset: record?.fixAsset ?? false,
          consignment: record?.consignment ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="description"
              rules={requiredField}
              label="Transaction Type Description"
              propsinput={{
                placeholder: "Transaction Type Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="flagValue"
              rules={requiredField}
              label="Transaction Type Flag Value"
              propsinput={{
                placeholder: "Transaction Type Flag Value",
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="fixAsset"
              valuePropName="checked"
              checkBoxLabel="Set as Fixed Asset Transaction"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="consignment"
              valuePropName="checked"
              checkBoxLabel="Set as Consignment Transaction"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="status"
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
