import React from "react";
import { CompanySettings } from "@/graphql/gql/graphql";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
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
import { UPSER_COMPANY_RECORD } from "@/graphql/company/queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormInputNumber } from "@/components/common";

interface IProps {
  hide: (hideProps: any) => void;
  record?: CompanySettings | null | undefined;
}

export default function UpsertCompanyModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  // ===================== Queries ==============================

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSER_COMPANY_RECORD,
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
          } Company`}</Space>
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
            icon={<SaveOutlined />}
          >
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }
    >
      <Form
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          companyName: record?.companyName,
          vatRate: record?.vatRate,
          markup: record?.markup,
          isActive: record?.isActive ?? false,
          hideInSelection: record?.hideInSelection ?? false,
        }}
      >
        <Row>
          <Col span={24}>
            <FormInput
              name="companyName"
              rules={requiredField}
              label="Company Name / Business Name"
              propsinput={{
                placeholder: "Company Name / Business Name",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Vat Rate (Multiplier)"
              name="vatRate"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Vat Rate (e.g 0.12)",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Markup (Multiplier)"
              name="markup"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Markup (e.g 0.5)",
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
          <Col span={24}>
            <FormCheckBox
              name="hideInSelection"
              valuePropName="checked"
              checkBoxLabel="Hide in Company Selection"
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
