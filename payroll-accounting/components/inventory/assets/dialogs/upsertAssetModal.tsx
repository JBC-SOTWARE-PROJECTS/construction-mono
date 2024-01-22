import { AssetStatus, AssetType, Assets, FixedAssetItems, Item } from "@/graphql/gql/graphql";
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


import FixedAssetSelector from "@/components/inventory/fixedAssetSelector";
import { useMutation, useQuery } from "@apollo/client";
import { useDialog } from "@/hooks";
import _ from "lodash";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Assets | null | undefined;
}

export default function UpsertAssetModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const showItems = useDialog(FixedAssetSelector);
  const [selectedItem, setSelectedItem] = useState<FixedAssetItems>();

  useEffect(() => {
    if (record) {
      setSelectedItem(record?.item as FixedAssetItems);
    }
  }, [record]);

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

  const onOpenItemSelector = (record?: Assets) => {
    showItems(
      { defaultSelected: [], defaultKey: [], isSingleSelection: true },
      (newItem: FixedAssetItems) => {
        if (!_.isEmpty(newItem)) {
          console.log("newItem", newItem)
          setSelectedItem(newItem);
        }
      }
    );
  };

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
    };
    payload.item = selectedItem?.itemId;
    payload.fixedAssetItem = selectedItem?.id;
    payload.type = values.type as AssetType;
    payload.status = values.status as AssetStatus;

    if (selectedItem?.id) {
      showPasswordConfirmation(() => {
        upsert({
          variables: {
            fields: payload,
            id: record?.id,
          },
        });
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
          ...record,
        }}
      >
        <Row gutter={[8, 0]}>
          <Col span={20}>
            <FormInput
              label="Item"
              propsinput={{
                placeholder: selectedItem?.itemName ?? "No item selected",
                disabled: true,
              }}
            />
          </Col>
          <Col span={4} className="dev-right">
            <Button
              className="mt-6-5"
              size="middle"
              type="primary"
              onClick={() => onOpenItemSelector()}
            >
              Select Item
            </Button>
          </Col>
          <Col span={24}>
            <FormInput
              name="sn-code"
              label="Fixed Asset Code / Serial No."
              propsinput={{
                placeholder: selectedItem ? selectedItem?.assetNo + " / "+ selectedItem?.serialNo  : "No item selected",
                disabled: true,
              }}
            />
          </Col>
          {/* <Col span={12}>
            <FormInput
              name="assetCode"
              label="Asset Code"
              propsinput={{
                placeholder: "Auto Generated",
                disabled: true,
              }}
            />
          </Col> */}

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
          <Col span={12}>
            <FormInput
              name="prefix"
              rules={requiredField}
              label="Asset Prefix"
              propsinput={{
                placeholder: "prefix",
              }}
            />
          </Col>
          <Col span={12}>
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
          {/* <Col span={12}>
            <FormInput
              name="brand"
              label="Brand"
              propsinput={{
                placeholder: selectedItem?.brand ?? "No item selected",
                disabled: true,
                value : selectedItem?.brand ?? ""
              }}
            />
          </Col> */}

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
            <FormInput
              name="description"
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
