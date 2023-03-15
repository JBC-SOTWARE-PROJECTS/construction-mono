import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import moment from "moment";

const AddCashCheck = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.type = props?.type;
    if (data.amount > props?.expected) {
      let diff = data?.amount - props?.expected;
      payload.amount = data?.amount - diff;
    }
    payload.amountTendered = data.amount;
    hide(payload);
  };

  return (
    <CModal
      width={"40%"}
      title={
        props.type == "CASH"
          ? "CASH"
          : props.type == "CHECK"
          ? "CHECK"
          : "GCASH"
      }
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="addCashCheckForm"
          key="submit"
          htmlType="submit"
          type="primary"
        >
          Submit
        </Button>,
      ]}
    >
      <MyForm
        name="addCashCheckForm"
        id="addCashCheckForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col span={24}>
            <FormInput
              description={"Amount"}
              type="number"
              name="amount"
              formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Amount"
            />
          </Col>
          {props.type == "CHECK" && (
            <>
              <Col span={24}>
                <FormInput
                  description={"Check #"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="reference"
                  placeholder="Check #"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Check Date"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={moment(new Date())}
                  name="checkDate"
                  type="datepicker"
                  placeholder="Check Date"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Bank"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="bank"
                  placeholder="bank"
                />
              </Col>
            </>
          )}
          {props.type == "GCASH" && (
            <>
              <Col span={24}>
                <FormInput
                  description={"Name/Mobile # of GCash"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="reference"
                  placeholder="Name/Mobile # of GCash"
                />
              </Col>
            </>
          )}
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddCashCheck;
