import React from "react";
import { Position } from "@/graphql/gql/graphql";
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
import { UPSER_POSITION_RECORD } from "@/graphql/positions/queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput } from "@/components/common";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Position | null | undefined;
}

export default function UpsertPositionModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  // ===================== Queries ==============================

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSER_POSITION_RECORD,
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
          } Position / Job Title`}</Space>
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
          description: record?.description,
          status: record?.status ?? false,
        }}
      >
        <Row>
          <Col span={24}>
            <FormInput
              name="description"
              rules={requiredField}
              label="Position Name / Job Title"
              propsinput={{
                placeholder: "Position Name / Job Title",
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
