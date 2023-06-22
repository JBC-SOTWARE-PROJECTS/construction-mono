import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { v4 as uuidv4 } from "uuid";
import { gql } from "apollo-boost";
import _ from "lodash";

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertJobOrderItems(id: $id, fields: $fields) {
      id
    }
  }
`;

const AddJobCharges = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Job Order Information Updated");
          } else {
            hide("Job Order Information Added");
          }
        }
      },
    }
  );

  const addCharges = (data) => {
    if (Number(data.qty) <= 0) {
      return setFormError({
        errorTitle: "Form Error",
        errorMsg: "Qty must greater than 0",
      });
    }

    if (Number(data.cost) <= 0) {
      return setFormError({
        errorTitle: "Form Error",
        errorMsg: "Cost must greater than 0",
      });
    }

    let payload = _.clone(data);
    payload.id = uuidv4();
    payload.subTotal = Number(data.qty) * Number(data.cost);
    payload.total = Number(data.qty) * Number(data.cost);
    payload.active = true;
    payload.isNew = true;
    console.log("payload => ", payload)
    hide([payload]);
  };

  return (
    <CModal
      width={"40%"}
      title="ADD CHARGES"
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="jobCharges"
          loading={upsertLoading}
          key="submit"
          htmlType="submit"
          type="primary"
        >
          Add Charges
        </Button>,
      ]}
    >
      <MyForm
        name="jobCharges"
        id="jobCharges"
        error={formError}
        onFinish={addCharges}
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
              description="Type"
              rules={[{ required: true, message: "This Field is required" }]}
              name="type"
              placeholder="Type"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Qty"}
              rules={[{ required: true, message: "This Field is required" }]}
              type="number"
              name="qty"
              placeholder="Qty"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description="Unit"
              rules={[{ required: true, message: "This Field is required" }]}
              name="unit"
              placeholder="Unit"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Cost"}
              rules={[{ required: true, message: "This Field is required" }]}
              type="number"
              name="cost"
              placeholder="Cost"
              formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddJobCharges;
