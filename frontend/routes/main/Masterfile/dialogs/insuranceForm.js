import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import CModal from "../../../../app/components/common/CModal";
import FormCheckbox from "../../../../util/customForms/formCheckbox";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertInsurance(id: $id, fields: $fields) {
      id
    }
  }
`;

const InsuranceForm = ({ visible, hide, ...props }) => {
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
            hide("Insurances Information Updated");
          } else {
            hide("Insurances Information Added");
          }
        }
      },
    }
  );

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
      },
    });
  };

  return (
    <CModal
      width={"30%"}
      title={"Insurance Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="insurancecForm"
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
        name="insurancecForm"
        id="insurancecForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col span={24}>
            <FormInput
              description={"Insurance Description"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="description"
              initialValue={props?.description}
              placeholder="Insurance Description"
            />
          </Col>
          <Col span={24}>
            <FormCheckbox
              description={"Set as Active"}
              name="is_active"
              valuePropName="checked"
              initialValue={props?.is_active}
              field="status"
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default InsuranceForm;
