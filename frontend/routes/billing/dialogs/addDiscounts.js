import React, { useState } from "react";
import { Col, Row, Button, message, Form } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormSelect from "../../../util/customForms/formSelect";
import CModal from "../../../app/components/common/CModal";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const UPSERT_RECORD = gql`
  mutation ($fields: Map_String_ObjectScalar, $id: UUID, $type: String) {
    upsert: addDiscounts(fields: $fields, id: $id, type: $type) {
      id
    }
  }
`;

const AddDiscounts = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  const [discountType, setDiscountType] = useState("FIX");
  const [form] = Form.useForm();
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          hide("Discount Added");
        }
      },
    }
  );
  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.description = `${data.type}[${data.description}]`;
    if (data.discountType == "PERCENTAGE") {
      delete payload.amount;
      payload.percent = data.amount;
    } else {
      payload.amount = data.amount;
    }
    if (data?.amount > 0) {
      upsertRecord({
        variables: {
          fields: payload,
          id: props?.id,
          type: props?.transType,
        },
      });
    } else {
      message.error("Amount must be greater than zero.");
    }
  };

  const { setFieldsValue } = form;

  return (
    <CModal
      width={"30%"}
      title={"ADD DISCOUNT"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="discForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
        >
          Push To Bill
        </Button>,
      ]}
    >
      <MyForm
        name="discForm"
        id="discForm"
        form={form}
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col span={24}>
            <FormSelect
              description={"Type"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={"DISCOUNT"}
              name="type"
              field="type"
              placeholder="Type"
              list={[
                { value: "DISCOUNT", label: "DISCOUNT" },
                { value: "DEDUCTION", label: "DEDUCTION" },
              ]}
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Description"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="description"
              placeholder="Description"
            />
          </Col>
          <Col span={24}>
            <FormSelect
              description={"Discount Type"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={"FIX"}
              name="discountType"
              field="discountType"
              placeholder="Discount Type"
              onChange={(e) => {
                setDiscountType(e);
                setFieldsValue({ ["amount"]: 0 });
              }}
              list={[
                {
                  value: "PERCENTAGE",
                  label: "PERCENTAGE",
                },
                {
                  value: "FIX",
                  label: "FIX",
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={
                discountType === "PERCENTAGE" ? "Percentage (%)" : "Fix Amount"
              }
              rules={[{ required: true, message: "This Field is required" }]}
              type="number"
              name="amount"
              initialValue={0}
              placeholder="0.00"
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddDiscounts;
