import { AssetStatus, AssetType, Assets, Item } from "@/graphql/gql/graphql";
import React, { useState, useEffect } from "react";
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
import { UPSERT_ASSET_RECORD, UPSERT_MAINTENANCE_TYPE_RECORD } from "@/graphql/assets/queries";

import ItemSelector from "@/components/inventory/itemSelector";
import { useMutation, useQuery } from "@apollo/client";
import { useDialog } from "@/hooks";
import _ from "lodash";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Assets | null | undefined;
}

export default function UpsertMaintenanceTypeModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_MAINTENANCE_TYPE_RECORD,
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
      ...values,
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

  const assetTypeOptions = Object.values(AssetType).map((item) => ({
    value: item,
    label: item.replace(/_/g, " "),
  }));

  const assetStatusOptions = Object.values(AssetStatus).map((item) => ({
    value: item,
    label: item.replace(/_/g, " "),
  }));
  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Maintenance Type`}</Space>
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
            form="upsertMaintenanceType"
            loading={upsertLoading}
            icon={<SaveOutlined />}
          >
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }
    >
      <Form
        name="upsertMaintenanceType"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
        }}
      >
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <FormInput
              name="name"
              label="Type Name"
              rules={requiredField}
              propsinput={{
                placeholder: "Type name",
              }}
            />
          </Col>

          <Col span={12}>
            <FormInput
              name="description"
              rules={requiredField}
              label="Description"
              propsinput={{
                placeholder: "Description",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
