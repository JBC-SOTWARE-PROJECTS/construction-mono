import React, { useState } from "react";

import { requiredField } from "@/utility/helper";
import { Button, Col, Form, message, Modal, Row, Space } from "antd";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import {
  FormInput,
  FormInputNumber,
  FormSelect,
  FormSwitch,
} from "@/components/common";
import { useMutation } from "@apollo/client";
import { UPSERT_ALLOWANCE_PACKAGE } from "@/graphql/company/queries";

interface typeProps {
  hide: (hideProps: any) => void;
  record: any;
}

interface valuesProps {
  id: string;
  name: string;
  status: boolean;
}

function AllowancePackageModal(props: typeProps) {
  const { hide, record } = props;
  const [form] = Form.useForm();

  const [active, setActive] = useState(record?.status || true);

  const [upsertAllowancePackage, { loading }] = useMutation(
    UPSERT_ALLOWANCE_PACKAGE,
    {
      onCompleted: ({ data }) => {
        if (data?.success) {
          message.success(data?.success && "Successfully Saved");
          hide(false);
        } else {
          message.error("Faild to Saved!");
        }
      },
    }
  );

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: valuesProps) => {
    upsertAllowancePackage({
      variables: {
        id: record?.id ?? null,
        fields: {
          name: values?.name,
          status: active,
        },
      },
    });
  };

  const onChange = (e: boolean) => {
    setActive(e);
  };

  return (
    <Modal
      title={`${record?.id ? "Edit" : "Add"} Allowance Package`}
      open
      destroyOnClose={true}
      maskClosable={false}
      onCancel={() => hide(false)}
      width={"100%"}
      style={{ maxWidth: "600px" }}
      footer={
        <Space>
          <Button
            danger
            type="primary"
            size="large"
            onClick={() => hide(false)}
            icon={<CloseCircleOutlined />}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertForm"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          name: record?.name || "",
          status: record?.status || null,
        }}
      >
        <Row>
          <Col span={24}>
            <FormInput
              label="Name"
              name="name"
              rules={requiredField}
              propsinput={{
                placeholder: "name",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSwitch
              name="status"
              label="Status"
              switchprops={{
                checkedChildren: "ACTIVE",
                unCheckedChildren: "IN-ACTIVE",
                checked: active,
                onChange: onChange,
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AllowancePackageModal;
