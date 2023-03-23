import React, { useContext, useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import moment from "moment";
import { AccountContext } from "../../../app/components/accessControl/AccountContext";

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertProjectNotes(id: $id, fields: $fields) {
      id
    }
  }
`;

const AddProjectUpdatesNotes = ({ visible, hide, ...props }) => {
  const account = useContext(AccountContext);
  /* error = { errorTitle: "", errorMsg: ""}*/
  //======================= =================== =================================================//
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props.id) {
            hide("Project Remarks/Notes Updated");
          } else {
            hide("Project Remarks/Notes Added");
          }
        }
      },
    }
  );

  const onSubmit = (data) => {
    let payload = _.clone(data);
    if (!props.id) {
      payload.projectUpdates = { id: props.parent?.id };
      payload.user = { id: account.id };
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
      title="Projects Remarks/Notes"
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
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col span={24}>
            <FormInput
              description={"Remarks/Notes"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.remarks}
              name="remarks"
              type="textarea"
              placeholder="Remarks/Notes"
              rows={8}
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddProjectUpdatesNotes;
