import React, { useState } from "react";
import { Col, Row, Button, message } from "antd";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import CModal from "../../../../app/components/common/CModal";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";

const GET_RECORDS = gql`
  {
    list: itemListActive {
      value: id
      label: descLong
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $itemId: UUID
    $supId: UUID
    $id: UUID
  ) {
    upsert: upsertSupplierItem(
      fields: $fields
      itemId: $itemId
      supId: $supId
      id: $id
    ) {
      id
    }
  }
`;

const AssignItemSupplierForm = ({ visible, hide, ...props }) => {
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
          hide("Item Successfully Added");
        }
        if (_.isEmpty(data?.upsert)) {
          message.error(
            "Item is already assigned on this Supplier. Please try again."
          );
        }
      },
    }
  );

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.supplier = { id: props?.id };
    payload.item = { id: data?.item };

    upsertRecord({
      variables: {
        fields: payload,
        itemId: data?.item,
        supId: props?.id,
        id: null,
      },
    });
  };

  return (
    <CModal
      width={"40%"}
      title={"Assign Item to Supplier"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="assignSupItemForm"
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
        name="assignSupItemForm"
        id="assignSupItemForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col span={24}>
            <FormSelect
              description={"Select Item to Assign"}
              loading={loading}
              rules={[{ required: true, message: "This Field is required" }]}
              name="item"
              field="item"
              placeholder="Select Item to Assign"
              list={_.get(data, "list")}
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Unit Cost (UoU)"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="cost"
              type="number"
              placeholder="Unit Cost (UoU)"
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AssignItemSupplierForm;
