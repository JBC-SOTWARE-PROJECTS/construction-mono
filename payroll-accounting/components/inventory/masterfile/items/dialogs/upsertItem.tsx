import React, { useState } from "react";
import { Item } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
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
import _ from "lodash";
import { UPSERT_RECORD_ITEM } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import {
  FormAutoComplete,
  FormCheckBox,
  FormInput,
  FormSelect,
  FormInputNumber,
} from "@/components/common";
import { responsiveColumn2, responsiveColumn4 } from "@/utility/constant";
import {
  useItemBrands,
  useItemCategory,
  useItemGenerics,
  useItemGroups,
  useItemSubAccount,
  useUnitOfPurchase,
  useUnitOfUsage,
} from "@/hooks/inventory";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Item | null | undefined;
}

export default function UpsertItemModal(props: IProps) {
  const { hide, record } = props;
  const [form] = Form.useForm();
  const [groupId, setGroupId] = useState<string | null>(
    record?.item_group ? record?.item_group?.id : null
  );
  const { setFieldValue } = form;
  // ===================== Queries ==============================
  const groups = useItemGroups();
  const categories = useItemCategory({ groupId: groupId });
  const brands = useItemBrands();
  const oup = useUnitOfPurchase();
  const uou = useUnitOfUsage();
  const generics = useItemGenerics();
  const assetSubAccounts = useItemSubAccount({
    type: ["ASSET", "FIXED_ASSET"],
  });
  const expenseSubAccounts = useItemSubAccount({ type: ["EXPENSE"] });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertItem?.success) {
          hide(data?.upsertItem?.message);
        } else {
          message.error(data?.upsertItem?.message);
        }
      },
    }
  );

  //================== functions ====================
  const onGenerateItemDescription = () => {
    const { setFieldValue, getFieldsValue } = form;
    const { item_generics, brand, specification } = getFieldsValue();
    const generated = `${item_generics?.label} ${
      specification ? specification + " " : ""
    }${brand ?? ""}`;
    setFieldValue("descLong", _.toUpper(generated));
  };

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (data: any) => {
    let payload = _.clone(data);
    payload.descLong = _.trim(data?.descLong);
    payload.brand = _.trim(data?.brand) || null;
    payload.specification = _.trim(data?.specification) || null;
    payload.isMedicine = data.isMedicine || false;
    payload.vatable = data.vatable || false;
    payload.discountable = data.discountable || false;
    payload.production = data.production || false;
    payload.consignment = data.consignment || false;
    payload.item_group = { id: data.item_group };
    payload.item_category = { id: data.item_category };
    payload.unit_of_purchase = { id: data.unit_of_purchase };
    payload.unit_of_usage = { id: data.unit_of_usage };
    payload.item_generics = { id: data.item_generics?.value };
    payload.assetSubAccount = { id: data.assetSubAccount };
    payload.expenseSubAccount = { id: data.expenseSubAccount };
    payload.active = data.active || false;

    upsertRecord({
      variables: {
        id: record?.id,
        fields: payload,
      },
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${record?.id ? "Edit" : "Add"} Item`}</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1200px" }}
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
          item_group: record?.item_group ? record?.item_group?.id : null,
          item_category: record?.item_category
            ? record?.item_category?.id
            : null,
          unit_of_purchase: record?.unit_of_purchase
            ? record?.unit_of_purchase?.id
            : null,
          unit_of_usage: record?.unit_of_usage
            ? record?.unit_of_usage?.id
            : null,
          item_generics: record?.item_generics
            ? record?.item_generics?.id
            : null,
          assetSubAccount: record?.assetSubAccount
            ? record?.assetSubAccount?.id
            : null,
          expenseSubAccount: record?.expenseSubAccount
            ? record?.expenseSubAccount?.id
            : null,
          item_conversion: record?.item_conversion ?? 1,
          item_maximum: record?.item_maximum ?? 0,
          active: record?.active ?? false,
          vatable: record?.vatable ?? false,
          discountable: record?.discountable ?? false,
          production: record?.production ?? false,
          fixAsset: record?.fixAsset ?? false,
          consignment: record?.consignment ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col {...responsiveColumn4}>
            <FormInput
              name="sku"
              label="SKU/Barcode"
              propsinput={{
                placeholder: "SKU/Barcode",
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormInput
              name="itemCode"
              label="Stock Code"
              propsinput={{
                placeholder: "Stock Code (Auto Generated)",
                disabled: true,
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              name="item_group"
              label="Item Group"
              rules={requiredField}
              propsselect={{
                options: groups,
                allowClear: true,
                placeholder: "Select Item Group",
                onChange: (newValue) => {
                  setGroupId(newValue);
                  setFieldValue("item_category", []);
                },
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              name="item_category"
              label="Item Category"
              rules={requiredField}
              propsselect={{
                options: categories,
                allowClear: true,
                placeholder: "Select Item Category",
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormSelect
              name="item_generics"
              label="Generic Name"
              rules={requiredField}
              propsselect={{
                showSearch: true,
                labelInValue: true,
                options: generics,
                allowClear: true,
                placeholder: "Select Generic Name",
                onChange: () => {
                  onGenerateItemDescription();
                },
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormAutoComplete
              name="brand"
              label="Item Brand"
              propsinput={{
                options: brands,
                placeholder: "Item Brand",
                onChange: () => {
                  onGenerateItemDescription();
                },
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="specification"
              label="Specification (Composed of sizes, weight, grade, shapes, capacity, etc. excluding Brand name)"
              propsinput={{
                placeholder: "e.g sizes, weight, grade, shapes, capacity",
                onChange: () => {
                  onGenerateItemDescription();
                },
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="descLong"
              label="Generated Item Description"
              propsinput={{
                readOnly: true,
                placeholder: "Item Description",
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              name="unit_of_purchase"
              label="Unit of Purchase"
              rules={requiredField}
              propsselect={{
                options: oup,
                allowClear: true,
                placeholder: "Select Unit of Purchase",
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              name="unit_of_usage"
              label="Unit of Usage"
              rules={requiredField}
              propsselect={{
                options: uou,
                allowClear: true,
                placeholder: "Select Unit of Usage",
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormInputNumber
              name="item_conversion"
              rules={requiredField}
              label="Conversion"
              propsinputnumber={{
                placeholder: "Conversion",
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormInputNumber
              name="item_maximum"
              rules={requiredField}
              label="Maximum Inventory"
              propsinputnumber={{
                placeholder: "Maximum Inventory",
              }}
            />
          </Col>
          <Divider plain>Accounting Integration</Divider>
          <Col {...responsiveColumn2}>
            <FormSelect
              name="assetSubAccount"
              label="Asset Category Subaccount"
              rules={requiredField}
              propsselect={{
                options: assetSubAccounts,
                allowClear: true,
                placeholder: "Select Asset Category",
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormSelect
              name="expenseSubAccount"
              label="Expense Category Subaccount"
              rules={requiredField}
              propsselect={{
                options: expenseSubAccounts,
                allowClear: true,
                placeholder: "Select Expense Category",
              }}
            />
          </Col>
          <Divider plain>Other Configuration</Divider>
          <Col {...responsiveColumn4}>
            <FormCheckBox
              name="active"
              valuePropName="checked"
              checkBoxLabel="Set as Active"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormCheckBox
              name="vatable"
              valuePropName="checked"
              checkBoxLabel="Set as Vatable"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormCheckBox
              name="discountable"
              valuePropName="checked"
              checkBoxLabel="Set as Discountable"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormCheckBox
              name="production"
              valuePropName="checked"
              checkBoxLabel="Set as Production Item"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormCheckBox
              name="fixAsset"
              valuePropName="checked"
              checkBoxLabel="Set as Fix Asset"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormCheckBox
              name="consignment"
              valuePropName="checked"
              checkBoxLabel="Set as Consignment"
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
