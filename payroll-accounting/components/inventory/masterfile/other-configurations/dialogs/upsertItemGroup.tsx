import React from "react";
import { ItemGroup } from "@/graphql/gql/graphql";
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
import { UPSERT_RECORD_ITEM_GROUP } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput } from "@/components/common";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ItemGroup | null | undefined;
}

export default function UpsertItemGroupModal(props: IProps) {
  const { hide, record } = props;
  // ===================== Queries ==============================
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_ITEM_GROUP,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertItemGroup) {
          hide(data?.upsertItemGroup);
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
          } Item Group`}</Space>
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
              name="itemCode"
              rules={requiredField}
              label="Item Group Code"
              propsinput={{
                placeholder: "Item Group Code",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="itemDescription"
              rules={requiredField}
              label="Item Group Description"
              propsinput={{
                placeholder: "Item Group Description",
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
