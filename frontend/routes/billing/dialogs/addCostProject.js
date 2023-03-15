
import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useMutation } from "@apollo/react-hooks";
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

const AddProjectUpdateForms = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
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

export default AddProjectUpdateForms;
