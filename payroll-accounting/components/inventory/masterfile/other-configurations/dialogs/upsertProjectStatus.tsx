import React from "react";
import { JobStatus } from "@/graphql/gql/graphql";
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
import { UPSERT_RECORD_PROJECT_STATUS } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormColorPicker, FormInput } from "@/components/common";
import { getRandomColor } from "@/hooks/accountReceivables/commons";

interface IProps {
  hide: (hideProps: any) => void;
  record?: JobStatus | null | undefined;
}

export default function UpsertProjectStatusModal(props: IProps) {
  const { hide, record } = props;
  const [form] = Form.useForm();
  // ===================== Queries ==============================
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PROJECT_STATUS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertJobStatus) {
          hide(data?.upsertJobStatus);
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    console.log("values", values);
    
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
          } Project Status`}</Space>
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
          statusColor: record?.statusColor ?? getRandomColor(),
          is_active: record?.is_active ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="code"
              rules={requiredField}
              label="Project Status Code"
              propsinput={{
                placeholder: "Project Status Code",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="description"
              rules={requiredField}
              label="Project Status Description"
              propsinput={{
                placeholder: "Project Status Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormColorPicker
              label="Color"
              name="statusColor"
              propscolorpicker={{
                format: "hex",
                onChange: (_, hex: string) => {
                  form.setFieldValue("statusColor", hex);
                },
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="disabledEditing"
              valuePropName="checked"
              checkBoxLabel="Disable Editing"
              propscheckbox={{
                defaultChecked: false,
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
