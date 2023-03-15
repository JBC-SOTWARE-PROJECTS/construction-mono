import React, { useContext, useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import FormSelect from "../../../util/customForms/formSelect";
import { AccountContext } from "../../../app/components/accessControl/AccountContext";

const GET_RECORDS = gql`
  {
    category: serviceCategoryActive {
      value: id
      label: description
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($items: [Map_String_ObjectScalar], $billing: UUID, $type: String) {
    upsert: addNewService(items: $items, billing: $billing, type: $type) {
      id
    }
  }
`;

const AddServiceBillingForm = ({ visible, hide, ...props }) => {
  const account = useContext(AccountContext);
  const [formError, setFormError] = useState({});
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
          hide("Service added to bill");
        }
      },
    }
  );
  //======================= =================== =================================================//
  const pushToBill = (data) => {
    if (Number(data?.cost) <= 0) {
      setFormError({
        errorTitle: "Invalid Cost",
        errorMsg: "Cost must not be less than zero or zero",
      });
    } else {
      let items = {
        id: uuidv4(),
        item: null,
        service: null,
        serviceCategory: data?.serviceCategory,
        description: data.descriptions,
        qty: 1,
        amount: data?.cost,
        subTotal: data?.cost,
        outputTax: 0,
        wcost: 0,
      };

      upsertRecord({
        variables: {
          items: [items],
          billing: props?.id,
          type: props?.transType,
          office: account?.office?.id,
        },
      });
    }
  };

  return (
    <CModal
      width={"40%"}
      title="ADD SERVICE"
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="miscForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
        >
          Push to Bill
        </Button>,
      ]}
    >
      <MyForm
        name="miscForm"
        id="miscForm"
        error={formError}
        onFinish={pushToBill}
        className="form-card"
      >
        <Row>
          <Col span={24}>
            <FormInput
              description={"Description"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="descriptions"
              type="textarea"
              placeholder="Description"
            />
          </Col>
          <Col span={24}>
            <FormSelect
              loading={loading}
              description={"Service Category"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="serviceCategory"
              field="serviceCategory"
              placeholder="Select Category"
              list={_.get(data, "category", [])}
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Cost"}
              rules={[{ required: true, message: "This Field is required" }]}
              type="number"
              name="cost"
              placeholder="Cost"
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddServiceBillingForm;
