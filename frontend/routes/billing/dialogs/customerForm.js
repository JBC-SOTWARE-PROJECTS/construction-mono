import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormSelect from "../../../util/customForms/formSelect";
import CModal from "../../../app/components/common/CModal";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2, CUS_TYPE } from "../../../shared/constant";
import _ from "lodash";

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertCustomer(id: $id, fields: $fields) {
      id
    }
  }
`;

const CustomerForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Customer Information Updated");
          } else {
            hide("Customer Information Added");
          }
        }
      },
    }
  );

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.isAssetsCustomer = props?.isAssetsCustomer || false;
    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
      },
    });
  };

  return (
    <CModal
      width={"65%"}
      title={"Customer Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="custForm"
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
        name="custForm"
        id="custForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col {...col2}>
            <FormInput
              description={"Customer Fullname"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="fullName"
              initialValue={_.toUpper(props?.fullName)}
              placeholder="Customer Fullname"
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              description={"Customer Type"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.customerType}
              name="customerType"
              field="customerType"
              placeholder="Customer Type"
              list={CUS_TYPE}
            />
          </Col>
          {/*  */}
          <Col span={24}>
            <FormInput
              description={"Address"}
              name="address"
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.address}
              placeholder="Address"
            />
          </Col>
          {/*  */}
          <Col {...col2}>
            <FormInput
              description={"Contact No."}
              rules={[{ required: true, message: "This Field is required" }]}
              name="telNo"
              initialValue={props?.telNo}
              placeholder="Contact No."
            />
          </Col>
          <Col {...col2}>
            <FormInput
              description={"Email Address"}
              name="emailAdd"
              initialValue={props?.emailAdd}
              placeholder="Email Address"
            />
          </Col>
          {/*  */}
          <Col {...col2}>
            <FormInput
              description={"Contact Person"}
              name="contactPerson"
              initialValue={props?.contactPerson}
              placeholder="Contact Person"
            />
          </Col>
          <Col {...col2}>
            <FormInput
              description={"Contact Person No."}
              name="contactPersonNum"
              initialValue={props?.contactPersonNum}
              placeholder="Contact Person No."
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default CustomerForm;
