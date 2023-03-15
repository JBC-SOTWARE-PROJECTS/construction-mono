import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import FormSelect from "../../../util/customForms/formSelect";

const GET_RECORDS = gql`
  {
    category: serviceCategoryActive {
      value: id
      label: description
    }
  }
`;

const AddServiceJobForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  //======================= =================== =================================================//
  const { loading, data } = useQuery(GET_RECORDS);

  const onSubmit = (data) => {
    if (Number(data?.cost) <= 0) {
      setFormError({
        errorTitle: "Invalid Cost",
        errorMsg: "Cost must not be less than zero or zero",
      });
    } else {
      let payload = {
        id: uuidv4(),
        type: "SERVICE",
        item: null,
        service: null,
        serviceCategory: data?.serviceCategory,
        descriptions: data?.descriptions,
        qty: 1,
        cost: data?.cost,
        subTotal: data?.cost,
        outputTax: 0,
        wcost: 0,
        billed: false,
        isNew: true,
      };
      hide([payload]);
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
        <Button form="miscForm" key="submit" htmlType="submit" type="primary">
          Submit
        </Button>,
      ]}
    >
      <MyForm
        name="miscForm"
        id="miscForm"
        error={formError}
        onFinish={onSubmit}
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

export default AddServiceJobForm;
