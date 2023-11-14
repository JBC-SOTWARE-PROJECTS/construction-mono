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
import { UPSERT_ASSET_RECORD } from "@/graphql/assets/queries";

import ItemSelector from "@/components/inventory/itemSelector";
import { useMutation, useQuery } from "@apollo/client";
import { useDialog } from "@/hooks";
import _ from "lodash";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Assets | null | undefined;
}

export default function UpsertPreventiveMaintenanceModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const showItems = useDialog(ItemSelector);
  const [selectedItem, setSelectedItem] = useState<Item>();

  useEffect(() => {
    if(record){
      setSelectedItem(record?.item as Item);
    }
  }, [record])
  

  // const [upsert, { loading: upsertLoading }] = useMutation(
  //   UPSERT_ASSET_RECORD,
  //   {
  //     ignoreResults: false,
  //     onCompleted: (data) => {
  //       if (data) {
  //         hide(data);
  //       }
  //     },
  //   }
  // );

  

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
    };
    payload.item = selectedItem?.id;
    payload.type = values.type as AssetType;
    payload.status = values.status as AssetStatus;

    if (selectedItem?.id) {
      showPasswordConfirmation(() => {
        // upsert({
        //   variables: {
        //     fields: payload,
        //     id: record?.id,
        //   },
        // });
      });
    }
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
          <Space align="center">{`${record?.id ? "Edit" : "Add"} Preventive Maintenance`}</Space>
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
           // loading={upsertLoading}
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
          ...record
        }}
      >
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <FormInput
              name="assetCode"
              label="Asset Code"
              propsinput={{
                placeholder: "Auto Generated",
                disabled: true,
              }}
            />
          </Col>

          <Col span={12}>
            <FormInput
              name="model"
              rules={requiredField}
              label="Asset Model"
              propsinput={{
                placeholder: "Model",
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
            <FormSelect
              name="type"
              label="Asset Type"
              rules={requiredField}
              propsselect={{
                options: assetTypeOptions,
                allowClear: true,
                placeholder: "Type",
              }}
            />
          </Col>

          <Col span={24}>
            <FormSelect
              name="status"
              label="Asset Status"
              rules={requiredField}
              propsselect={{
                options: assetStatusOptions,
                allowClear: true,
                placeholder: "Status",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
