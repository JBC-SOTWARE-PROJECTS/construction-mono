import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import moment from "moment";
import FormSelect from "../../../util/customForms/formSelect";
import { JOB_STATUS } from "../../../shared/constant";

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertProjectUpdates(id: $id, fields: $fields) {
      id
    }
  }
`;

const AddProjectCostForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  /* error = { errorTitle: "", errorMsg: ""}*/
  //======================= =================== =================================================//

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props.id) {
            hide("Project Milestone Updated");
          } else {
            hide("Project Milestone Added");
          }
        }
      },
    }
  );

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.project = props?.project;
    if (!props.id) {
      payload.dateTransact = moment();
    }
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
      title="ADD PROJECT MILESTONES"
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
            <FormInput
              description={"Start Date"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.startDate)}
              name="startDate"
              type="datepicker"
              placeholder="Estimate Project End Date"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Estimate End Date (Duration of Work)"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.estimateEndDate)}
              name="estimateEndDate"
              type="datepicker"
              placeholder="Estimate Project End Date"
            />
          </Col>
          <Col span={24}>
            <FormSelect
              initialValue={props?.status}
              description={"Status"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="status"
              field="status"
              placeholder="Select Status"
              list={JOB_STATUS}
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddProjectCostForm;
