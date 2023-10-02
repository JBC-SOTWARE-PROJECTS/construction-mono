import React from "react";
import FormTextArea from "@/components/common/formTextArea/formTextArea";
import { ApTransaction } from "@/graphql/gql/graphql";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Alert,
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  App,
} from "antd";
import _ from "lodash";
import { useSupplierTypes } from "@/hooks/payables";
import { UPSERT_TRANSACTION_TYPE } from "@/graphql/payables/config-queries";
import FormInput from "@/components/common/formInput/formInput";
import { requiredField } from "@/utility/helper";
import FormCheckBox from "@/components/common/formCheckBox/formCheckBox";
import FormSelect from "@/components/common/formSelect/formSelect";
import { AP_TRANSCTION_CATEGORY } from "@/utility/constant";

interface IProps {
  hide: (hideProps: any) => void;
  record: ApTransaction | null | undefined;
  parentRefetch: () => void;
}

export default function APTransactionTypeModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;

  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  // ===================== Queries ==============================
  const types = useSupplierTypes();

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_TRANSACTION_TYPE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
      supplierType: { id: values?.supplierType },
      status: values.status ?? false,
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
          flagValue: record?.flagValue,
          supplierType: record?.supplierType?.id,
          category: record?.category,
          status: record?.status ?? false,
        }}>
        <Row>
          <Col span={24} className="mb-2-5">
            <Alert
              type="info"
              message="Use underscore ( _ ) if you want separate words in flag value. Don't use space."
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="description"
              rules={requiredField}
              label="AP Transaction Description"
              propsinput={{
                placeholder: "Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              label="Flag Value"
              name="flagValue"
              rules={requiredField}
              propsinput={{
                placeholder: "Flag Value",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              name="supplierType"
              label="Supplier Types"
              propsselect={{
                options: types,
                allowClear: true,
                placeholder: "Select Supplier Type",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              name="category"
              label="Category"
              rules={requiredField}
              propsselect={{
                options: AP_TRANSCTION_CATEGORY,
                allowClear: true,
                placeholder: "Select Category",
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
