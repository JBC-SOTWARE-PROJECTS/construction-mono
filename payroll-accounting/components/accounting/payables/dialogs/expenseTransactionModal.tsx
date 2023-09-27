import React from "react";
import FormTextArea from "@/components/common/formTextArea/formTextArea";
import { ExpenseTransaction } from "@/graphql/gql/graphql";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { UPSERT_EXP_TRANSACTION_RECORD } from "@/graphql/payables/config-queries";
import FormInput from "@/components/common/formInput/formInput";
import { requiredField } from "@/utility/helper";
import FormCheckBox from "@/components/common/formCheckBox/formCheckBox";
import FormSelect from "@/components/common/formSelect/formSelect";
import { SOURCE_CLOUMN } from "@/utility/constant";

interface IProps {
  hide: (hideProps: any) => void;
  record: ExpenseTransaction | null | undefined;
  parentRefetch: () => void;
}

export default function ExpenseTransactionTypeModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;

  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  // ===================== Queries ==============================
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_EXP_TRANSACTION_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        let payload = data.upsertExTransType;
        if (payload.success) {
          hide(payload);
        } else {
          message.error(payload.message);
        }
      },
    }
  );
  //================== functions ================================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
      isReverse: values.isReverse ?? false,
      status: values.status ?? false,
      type: record?.type,
    };
    showPasswordConfirmation(() => {
      upsert({
        variables: {
          fields: payload,
          id: record?.id,
        },
      });
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
      style={{ maxWidth: "600px" }}
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
          description: record?.description,
          source: record?.source,
          remarks: record?.remarks,
          isReverse: record?.isReverse ?? false,
          status: record?.status ?? false,
        }}>
        <Row>
          <Col span={24}>
            <FormInput
              name="description"
              rules={requiredField}
              label="Transaction Description"
              propsinput={{
                placeholder: "Description",
              }}
            />
          </Col>

          <Col span={24}>
            <FormSelect
              name="source"
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
            <FormTextArea
              label="Remarks/Notes"
              name="remarks"
              propstextarea={{
                placeholder: "Remarks/Notes",
              }}
            />
          </Col>

          <Col span={24}>
            <FormCheckBox
              name="isReverse"
              valuePropName="checked"
              checkBoxLabel="Reverse Normal Side (Debit/Credit)"
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
