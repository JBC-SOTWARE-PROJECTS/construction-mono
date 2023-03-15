import React, { useState } from "react";
import { Col, Row, Button, Divider, Form } from "antd";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import CModal from "../../../../app/components/common/CModal";
import FormCheckbox from "../../../../util/customForms/formCheckbox";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2, SUP_EN_TYPE, VAT_CON } from "../../../../shared/constant";
import _ from "lodash";

const GET_RECORDS = gql`
  {
    pt: paymentTermActive {
      value: id
      label: paymentDesc
    }
    st: supplierTypeActive {
      value: id
      label: supplierTypeDesc
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertSupplier(id: $id, fields: $fields) {
      id
    }
  }
`;

const SupplierForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  const [isVatable, setIsVatable] = useState(props?.isVatable);
  const [form] = Form.useForm();
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  const { loading, data } = useQuery(GET_RECORDS);

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Supplier Information Updated");
          } else {
            hide("Supplier Information Added");
          }
        }
      },
    }
  );

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.isVatInclusive = data.isVatInclusive || false;
    payload.paymentTerms = { id: data.paymentTerms };
    payload.supplierTypes = { id: data.supplierTypes };
    console.log("payload => ", data);
    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
      },
    });
  };

  console.log("is vatable ", form.getFieldValue("isVatable"));

  return (
    <CModal
      width={"80%"}
      title={"Supplier Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="supplierForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <MyForm
        form={form}
        name="supplierForm"
        id="supplierForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col {...col2}>
            <Divider>General Information</Divider>
            <Row>
              <Col span={24}>
                <FormInput
                  description={"Supplier Code"}
                  name="supplierCode"
                  initialValue={props?.supplierCode}
                  placeholder="Supplier Code"
                  disabled
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Supplier Name"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="supplierFullname"
                  initialValue={props?.supplierFullname}
                  placeholder="Supplier Name"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Tin Number"}
                  name="supplierTin"
                  initialValue={props?.supplierTin}
                  placeholder="Tin Number"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Email Address"}
                  name="supplierEmail"
                  initialValue={props?.supplierEmail}
                  placeholder="Email Address"
                />
              </Col>
              <Col span={24}>
                <FormSelect
                  description={"Terms of Payment"}
                  loading={loading}
                  initialValue={props?.paymentTerms?.id}
                  name="paymentTerms"
                  field="paymentTerms"
                  placeholder="Terms of Payment"
                  list={_.get(data, "pt")}
                />
              </Col>
              <Col span={24}>
                <FormSelect
                  description={"Supplier Entity Type"}
                  initialValue={props?.supplierEntity}
                  name="supplierEntity"
                  field="supplierEntity"
                  placeholder="Supplier Entity Type"
                  list={SUP_EN_TYPE}
                />
              </Col>
              <Col span={24}>
                <FormSelect
                  description={"Supplier Category"}
                  initialValue={props?.supplierTypes?.id}
                  name="supplierTypes"
                  field="supplierTypes"
                  placeholder="Supplier Category"
                  list={_.get(data, "st")}
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Credit Limit"}
                  name="creditLimit"
                  initialValue={props?.creditLimit}
                  placeholder="Credit Limit"
                />
              </Col>
              <Col span={24}>
                <FormSelect
                  description={"Vat Condition"}
                  initialValue={props?.isVatable}
                  name="isVatable"
                  field="isVatable"
                  onChange={(e) => {
                    setIsVatable(e);
                  }}
                  placeholder="Vat Condition"
                  list={VAT_CON}
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Lead Time"}
                  name="leadTime"
                  type="number"
                  initialValue={props?.leadTime}
                  placeholder="Lead Time"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Remarks"}
                  name="remarks"
                  initialValue={props?.remarks}
                  placeholder="Remarks"
                />
              </Col>
              <Col span={12}>
                <FormCheckbox
                  description={"Vat Inclusive"}
                  name="isVatInclusive"
                  valuePropName="checked"
                  initialValue={props?.isVatInclusive}
                  disabled={!isVatable}
                  field="isVatInclusive"
                />
              </Col>
              <Col span={12}>
                <FormCheckbox
                  description={"Set as Active"}
                  name="isActive"
                  valuePropName="checked"
                  initialValue={props?.isActive}
                  field="status"
                />
              </Col>
            </Row>
          </Col>
          <Col {...col2}>
            <Divider>Primary Address</Divider>
            <Row>
              <Col span={24}>
                <FormInput
                  description={"Address"}
                  type="textarea"
                  name="primaryAddress"
                  initialValue={props?.primaryAddress}
                  placeholder="Address"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Telephone Number"}
                  name="primaryTelphone"
                  initialValue={props?.primaryTelphone}
                  placeholder="Telephone Number"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Contact Person"}
                  name="primaryContactPerson"
                  initialValue={props?.primaryContactPerson}
                  placeholder="Contact Person"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Fax Number"}
                  name="primaryFax"
                  initialValue={props?.primaryFax}
                  placeholder="Fax Number"
                />
              </Col>
            </Row>
            <Divider>Secondary Address</Divider>
            <Row>
              <Col span={24}>
                <FormInput
                  description={"Address"}
                  type="textarea"
                  name="secondaryAddress"
                  initialValue={props?.secondaryAddress}
                  placeholder="Address"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Telephone Number"}
                  name="secondaryTelphone"
                  initialValue={props?.secondaryTelphone}
                  placeholder="Telephone Number"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Contact Person"}
                  name="secondaryContactPerson"
                  initialValue={props?.secondaryContactPerson}
                  placeholder="Contact Person"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Fax Number"}
                  name="secondaryFax"
                  initialValue={props?.secondaryFax}
                  placeholder="Fax Number"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default SupplierForm;
