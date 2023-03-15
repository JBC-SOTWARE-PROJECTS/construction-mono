import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import moment from "moment";
import FormSelect from "../../../util/customForms/formSelect";

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertProjectUpdates(id: $id, fields: $fields) {
      id
    }
  }
`;

const GET_RECORDS = gql`
  {
    projectStatus: jobStatusActive {
      value: description
      label: description
    }
  }
`;

const AddProjectCostForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  /* error = { errorTitle: "", errorMsg: ""}*/
  //======================= =================== =================================================//
  const { loading: loadingFilter, data: filterData } = useQuery(GET_RECORDS);

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
    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
      },
    });
  };

  return (
    <CModal
      width={"40%"}
      title="ADD PROJECT UPDATES"
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
              initialValue={props?.description}
              name="description"
              type="textarea"
              placeholder="Description"
            />
          </Col>
          <Col span={24}>
            <FormSelect
              loading={loadingFilter}
              initialValue={props?.status}
              description={"Status"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="status"
              field="status"
              placeholder="Select Status"
              list={_.get(filterData, "projectStatus", [])}
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddProjectCostForm;
