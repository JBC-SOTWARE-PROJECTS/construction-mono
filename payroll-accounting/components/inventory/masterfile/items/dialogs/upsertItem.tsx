import React, { useState } from "react";
import { Item } from "@/graphql/gql/graphql";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
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
import {
  GET_RECORDS_ADDRESS,
  UPSER_OFFICE_RECORD,
} from "@/graphql/offices/queries";
import { requiredField } from "@/utility/helper";
import {
  FormAutoComplete,
  FormCheckBox,
  FormInput,
  FormSelect,
} from "@/components/common";
import { useCompany } from "@/hooks/administrative";
import {
  OFFICETYPE,
  responsiveColumn2,
  responsiveColumn3,
  responsiveColumn4,
} from "@/utility/constant";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Item | null | undefined;
}

export default function UpsertItemModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  // ===================== Queries ==============================

  const { loading, data } = useQuery(GET_RECORDS_ADDRESS, {
    variables: {
      provice: null,
      city: null,
    },
  });

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSER_OFFICE_RECORD,
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
      company: { id: values?.company },
      provinceId: null,
      cityId: null,
      status: values.status ?? false,
    };
    console.log("payload", payload);
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
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
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
              rules={requiredField}
              label="SKU/Barcode"
              propsinput={{
                placeholder: "SKU/Barcode",
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormInput
              name="itemCode"
              rules={requiredField}
              label="Stock Code"
              propsinput={{
                placeholder: "Stock Code",
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              name="item_group"
              label="Item Group"
              rules={requiredField}
              propsselect={{
                options: OFFICETYPE,
                allowClear: true,
                placeholder: "Select Item Group",
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              name="item_category"
              label="Item Category"
              rules={requiredField}
              propsselect={{
                options: OFFICETYPE,
                allowClear: true,
                placeholder: "Select Item Category",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="descLong"
              rules={requiredField}
              label="Item Description"
              propsinput={{
                placeholder: "Item Description",
              }}
            />
          </Col>
          <Col {...responsiveColumn3}>
            <FormAutoComplete
              name="brand"
              rules={requiredField}
              label="Item Brand"
              propsinput={{
                options: [],
                placeholder: "Item Brand",
              }}
            />
          </Col>
          <Col {...responsiveColumn3}>
            <FormSelect
              name="unit_of_purchase"
              label="Unit of Purchase"
              rules={requiredField}
              propsselect={{
                options: OFFICETYPE,
                allowClear: true,
                placeholder: "Select Unit of Purchase",
              }}
            />
          </Col>
          <Col {...responsiveColumn3}>
            <FormSelect
              name="unit_of_usage"
              label="Unit of Usage"
              rules={requiredField}
              propsselect={{
                options: OFFICETYPE,
                allowClear: true,
                placeholder: "Select Unit of Usage",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              name="item_generics"
              label="Generic Name"
              rules={requiredField}
              propsselect={{
                options: OFFICETYPE,
                allowClear: true,
                placeholder: "Select Generic Name",
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormInputNumber
              name="item_conversion"
              rules={requiredField}
              label="Conversion"
              propsinputnumber={{
                placeholder: "Conversion",
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
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
              name="asset_category"
              label="Asset Category Subaccount"
              rules={requiredField}
              propsselect={{
                options: OFFICETYPE,
                allowClear: true,
                placeholder: "Select Asset Category",
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormSelect
              name="expense_category"
              label="Expense Category Subaccount"
              rules={requiredField}
              propsselect={{
                options: OFFICETYPE,
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
