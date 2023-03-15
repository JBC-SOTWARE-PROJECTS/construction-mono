import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormSelect from "../../../util/customForms/formSelect";
import CModal from "../../../app/components/common/CModal";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";

const GET_RECORDS = gql`
  {
    jobStatus: jobStatusActive {
      value: description
      label: description
    }
  }
`;

const UpdateJobStatusForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  const { loading, data } = useQuery(GET_RECORDS, {
    fetchPolicy: "network-only",
  });

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.id = props?.id;
    hide(payload);
  };

  return (
    <CModal
      width={"30%"}
      title={"Job Order Status"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button form="statusForm" key="submit" htmlType="submit" type="primary">
          Submit
        </Button>,
      ]}
    >
      <MyForm
        name="statusForm"
        id="statusForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col span={24}>
            <FormSelect
              loading={loading}
              description={"Job Status (Mark as)"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.status}
              name="status"
              field="status"
              placeholder="Job Status (Mark as)"
              list={_.get(data, "jobStatus")}
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default UpdateJobStatusForm;
