import React from "react";
import { PaymentTerm } from "@/graphql/gql/graphql";
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
import { UPSERT_RECORD_PAYMENT_TERMS } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormInputNumber } from "@/components/common";

interface IProps {
  hide: (hideProps: any) => void;
  record?: PaymentTerm | null | undefined;
}

export default function UpsertPaymentTermsModal(props: IProps) {
  const { hide, record } = props;
  // ===================== Queries ==============================
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PAYMENT_TERMS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertPaymentTerms) {
          hide(data?.upsertPaymentTerms);
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
          } Payment Term`}</Space>
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
          isActive: record?.isActive ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="paymentCode"
              rules={requiredField}
              label="Payment Term Code"
              propsinput={{
                placeholder: "Payment Term Code",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="paymentDesc"
              rules={requiredField}
              label="Payment Term Description"
              propsinput={{
                placeholder: "Payment Term Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              name="paymentNoDays"
              rules={requiredField}
              label="Number of Days"
              propsinputnumber={{
                placeholder: "Number of Days",
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
