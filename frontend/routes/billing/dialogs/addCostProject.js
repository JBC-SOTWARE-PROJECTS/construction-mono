import React, { useState } from "react";
import { Col, Row, Button, Form } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import moment from "moment";

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertProjectCost(id: $id, fields: $fields) {
      id
    }
  }
`;

const GET_CATEGORY = gql`
  {
    category: getCategoryProjects {
      value: category
    }
    units: getUnitProjects {
      value: unit
    }
  }
`;

const AddProjectUpdateForms = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  const [form] = Form.useForm();
  const { data } = useQuery(GET_CATEGORY);
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  //======================= =================== =================================================//
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          hide("Project Cost Added");
        }
      },
    }
  );

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.project = props?.project;
    payload.dateTransact = moment();
    payload.category = _.trim(data.category);
    payload.unit = _.trim(data.unit);
    payload.status = true;
    if (Number(data?.cost) <= 0) {
      setFormError({
        errorTitle: "Invalid Cost",
        errorMsg: "Cost must not be less than zero or zero",
      });
    } else {
      upsertRecord({
        variables: {
          id: props?.id,
          fields: payload,
        },
      });
    }
  };

  const calculateTotal = (el, value) => {
    const { getFieldValue, setFieldValue } = form;
    if (el === "qty") {
      let cost = getFieldValue("cost");
      if (cost) {
        let total = cost * value;
        setFieldValue("totalcost", total);
      }
    } else {
      let qty = getFieldValue("qty");
      if (qty) {
        let total = qty * value;
        setFieldValue("totalcost", total);
      }
    }
  };

  return (
    <CModal
      width={"40%"}
      title="ADD PROJECT COST"
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
          Submit
        </Button>,
      ]}
    >
      <MyForm
        form={form}
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
              name="description"
              type="textarea"
              placeholder="Description"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Reference Number"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="refNo"
              placeholder="Reference Number e.g A.1.1(6)"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Category"}
              name="category"
              type="autocomplete"
              options={_.get(data, "category", [])}
              placeholder="Category"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Qty"}
              rules={[{ required: true, message: "This Field is required" }]}
              type="number"
              name="qty"
              placeholder="Quantity"
              onChange={(e) => calculateTotal("qty", e)}
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Unit"}
              name="unit"
              type="autocomplete"
              options={_.get(data, "units", [])}
              placeholder="Unit (e.g Month, each, lot)"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Unit Price"}
              rules={[{ required: true, message: "This Field is required" }]}
              type="number"
              name="cost"
              placeholder="Unit Price"
              onChange={(e) => calculateTotal("cost", e)}
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Total Cost"}
              type="number"
              name="totalcost"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Total"
              disabled={true}
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddProjectUpdateForms;
