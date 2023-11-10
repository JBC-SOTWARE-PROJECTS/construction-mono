import { Assets } from "@/graphql/gql/graphql";
import React from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { UPSERT_ASSET_RECORD } from "@/graphql/assets/queries";

import { useMutation, useQuery } from "@apollo/client";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Assets | null | undefined;
}

export default function UpsertAssetModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();


  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_ASSET_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );


  const onSubmit = (values: any) => {
    
    let payload = {
      ...values
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

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${record?.id ? "Edit" : "Add"} Asset`}</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "800px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertAsset"
            loading={upsertLoading}
            icon={<SaveOutlined />}
          >
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }
    >
      <Form
        name="upsertAsset"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
            assetCode: ""
        }}
      >
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <FormInput
              name="code"
              
              label="Asset Code"
              propsinput={{
                placeholder: "Code",
              }}
            />
          </Col>
          <Col span={12}>
            <FormInput
              name="item"
              rules={requiredField}
              label="Item"
              propsinput={{
                placeholder: "Item",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="description"
              rules={requiredField}
              label="Description"
              propsinput={{
                placeholder: "Description",
              }}
            />
          </Col>

          <Col span={12}>
            <FormInput
              name="brand"
              rules={requiredField}
              label="Brand"
              propsinput={{
                placeholder: "Brand",
              }}
            />
          </Col>
          <Col span={12}>
            <FormInput
              name="type"
              rules={requiredField}
              label="Asset Type"
              propsinput={{
                placeholder: "Type",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="model"
              rules={requiredField}
              label="Asset Model"
              propsinput={{
                placeholder: "Model",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
