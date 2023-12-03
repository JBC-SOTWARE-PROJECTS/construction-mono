import React from "react";
import { Supplier } from "@/graphql/gql/graphql";
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
import { UPSERT_RECORD_SUPPLER } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import {
  FormCheckBox,
  FormInput,
  FormSelect,
  FormTextArea,
} from "@/components/common";
import { SUP_EN_TYPE, VAT_CON, responsiveColumn2 } from "@/utility/constant";
import { usePaymentTerms } from "@/hooks/payables";
import { useSupplierTypes } from "@/hooks/inventory";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Supplier | null | undefined;
}

export default function UpsertSupplierModal(props: IProps) {
  const { hide, record } = props;
  // ===================== Queries ==============================
  const paymentTerms = usePaymentTerms();
  const supplierTypes = useSupplierTypes();

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_SUPPLER,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertSupplier?.id) {
          hide(data?.upsertSupplier);
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    let payload = _.clone(values);
    payload.isVatInclusive = values?.isVatInclusive || false;
    payload.paymentTerms = { id: values?.paymentTerms };
    payload.supplierTypes = { id: values?.supplierTypes };
    payload.isVatable = values?.isVatable === "true" ? true : false;

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
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Supplier`}</Space>
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
          paymentTerms: record?.paymentTerms?.id ?? null,
          supplierTypes: record?.supplierTypes?.id ?? null,
          supplierCode: record?.supplierCode ?? "Auto Generated",
          isVatable: record?.isVatable ? "true" : "false",
          isVatInclusive: record?.isVatInclusive ?? false,
          isActive: record?.isActive ?? false,
        }}>
        <Row gutter={[8, 8]}>
          <Col {...responsiveColumn2}>
            <Divider plain>General Information</Divider>
            <Row gutter={[8, 0]}>
              <Col span={24}>
                <FormInput
                  name="supplierCode"
                  rules={requiredField}
                  label="Supplier Code"
                  propsinput={{
                    disabled: true,
                    placeholder: "Supplier Code",
                  }}
                />
              </Col>
              <Col span={24}>
                <FormInput
                  name="supplierFullname"
                  rules={requiredField}
                  label="Supplier Name"
                  propsinput={{
                    placeholder: "Supplier Name",
                  }}
                />
              </Col>
              <Col span={24}>
                <FormInput
                  name="supplierTin"
                  label="Tin Number"
                  propsinput={{
                    placeholder: "Tin Number",
                  }}
                />
              </Col>
              <Col span={24}>
                <FormInput
                  name="supplierEmail"
                  rules={requiredField}
                  label="Email Address"
                  propsinput={{
                    placeholder: "Email Address",
                  }}
                />
              </Col>
              <Col span={24}>
                <FormSelect
                  name="paymentTerms"
                  label="Terms of Payment"
                  rules={requiredField}
                  propsselect={{
                    options: paymentTerms,
                    allowClear: true,
                    placeholder: "Select Terms of Payment",
                  }}
                />
              </Col>
              <Col span={24}>
                <FormSelect
                  name="supplierEntity"
                  label="Supplier Entity Type"
                  rules={requiredField}
                  propsselect={{
                    options: SUP_EN_TYPE,
                    allowClear: true,
                    placeholder: "Select Supplier Entity Type",
                  }}
                />
              </Col>
              <Col span={24}>
                <FormSelect
                  name="supplierTypes"
                  label="Supplier Category"
                  rules={requiredField}
                  propsselect={{
                    options: supplierTypes,
                    allowClear: true,
                    placeholder: "Select Supplier Category",
                  }}
                />
              </Col>
              <Col {...responsiveColumn2}>
                <FormSelect
                  name="isVatable"
                  label="Vat Condition"
                  propsselect={{
                    options: VAT_CON,
                    allowClear: true,
                    placeholder: "Select Vat Condition",
                  }}
                />
              </Col>
              <Col {...responsiveColumn2}>
                <FormInput
                  name="atcNo"
                  label="ATC No"
                  propsinput={{
                    placeholder: "ATC No",
                  }}
                />
              </Col>
              <Col span={24}>
                <FormInput
                  name="remarks"
                  label="Remarks"
                  propsinput={{
                    placeholder: "Remarks",
                  }}
                />
              </Col>
              <Col {...responsiveColumn2}>
                <FormCheckBox
                  name="isVatInclusive"
                  valuePropName="checked"
                  checkBoxLabel="Vat Inclusive"
                  propscheckbox={{
                    defaultChecked: false,
                  }}
                />
              </Col>
              <Col {...responsiveColumn2}>
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
          </Col>
          <Col {...responsiveColumn2}>
            <Divider plain>Primary Address</Divider>
            <Col span={24}>
              <FormTextArea
                name="primaryAddress"
                label="Address"
                rules={requiredField}
                propstextarea={{
                  rows: 3,
                  placeholder: "Address",
                }}
              />
            </Col>
            <Col span={24}>
              <FormInput
                name="primaryTelphone"
                label="Contact Number"
                rules={requiredField}
                propsinput={{
                  placeholder: "Contact Number",
                }}
              />
            </Col>
            <Col span={24}>
              <FormInput
                name="primaryContactPerson"
                label="Contact Person"
                rules={requiredField}
                propsinput={{
                  placeholder: "Contact Person",
                }}
              />
            </Col>
            <Col span={24}>
              <FormInput
                name="primaryFax"
                label="Fax Number"
                propsinput={{
                  placeholder: "Fax Number",
                }}
              />
            </Col>
            <Divider plain>Secondary Address</Divider>
            <Col span={24}>
              <FormTextArea
                name="secondaryAddress"
                label="Address"
                propstextarea={{
                  rows: 3,
                  placeholder: "Address",
                }}
              />
            </Col>
            <Col span={24}>
              <FormInput
                name="secondaryTelphone"
                label="Contact Number"
                propsinput={{
                  placeholder: "Contact Number",
                }}
              />
            </Col>
            <Col span={24}>
              <FormInput
                name="secondaryContactPerson"
                label="Contact Person"
                propsinput={{
                  placeholder: "Contact Person",
                }}
              />
            </Col>
            <Col span={24}>
              <FormInput
                name="secondaryFax"
                label="Fax Number"
                propsinput={{
                  placeholder: "Fax Number",
                }}
              />
            </Col>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
