import React, { useState } from "react";
import {
  Col,
  Row,
  Button,
  message,
  Table,
  Typography,
  Form,
  Divider,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import FormSelect from "../../../util/customForms/formSelect";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import numeral from "numeral";
import moment from "moment";
import { col3 } from "../../../shared/constant";
import AddCashCheck from "./addCashCheck";
import { dialogHook } from "../../../util/customhooks";

const UPSERT_RECORD = gql`
  mutation (
    $billing: UUID
    $shift: UUID
    $type: String
    $payment: Map_String_ObjectScalar
    $payment_details: [Map_String_ObjectScalar]
  ) {
    upsert: addPayment(
      billing: $billing
      shift: $shift
      type: $type
      payment: $payment
      payment_details: $payment_details
    ) {
      id
    }
  }
`;

const { Text } = Typography;

const Payments = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState(props?.amount);
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          hide("Successfully Added Payments");
        }
      },
    }
  );

  const [modal, showModal] = dialogHook(AddCashCheck, (value) => {
    if (value) {
      let data = _.clone(items);
      let cheque = null;
      if (value?.checkDate) {
        cheque = moment(value?.checkDate).format("MM/DD/YYYY");
      }
      let x = {
        id: randomizeInteger(),
        amount: value?.amount,
        amountTendered: value?.amountTendered,
        type: value?.type,
        reference: value?.reference,
        checkDate: cheque,
        bank: value?.bank,
      };
      data.push(x);
      setItems(data);
      setAmount(amount - value?.amount);
    }
  });

  //======================= =================== =================================================//
  const randomizeInteger = (min, max) => {
    if (max == null) {
      max = min == null ? Number.MAX_SAFE_INTEGER : min;
      min = 0;
    }

    min = Math.ceil(min); // inclusive min
    max = Math.floor(max); // exclusive max

    if (min > max - 1) {
      throw new Error("Incorrect arguments.");
    }

    return min + Math.floor((max - min + 1) * Math.random());
  };

  const onRemove = (id) => {
    let index = items.findIndex((e) => e.id === id);
    let data = _.clone(items);
    if (data[index]) {
      setAmount(amount + data[index].amount);
      _.remove(data, function (element) {
        return element.id === data[index].id;
      });
    }

    setItems(data);
  };

  const onSubmit = (value) => {
    let payload = _.clone(value);
    let cash = _.filter(items, ["type", "CASH"]);
    let check = _.filter(items, ["type", "CHECK"]);
    payload.totalPayments = value?.amount;
    payload.totalCash = _.sumBy(cash, "amount");
    payload.totalCheck = _.sumBy(check, "amount");

    if (_.sumBy(items, "amount") >= props.amount) {
      console.log(props);
      upsertRecord({
        variables: {
          billing: props.bill_id,
          shift: props.shift_id,
          type: props.type,
          payment: payload,
          payment_details: items,
        },
      });
    } else {
      message.error("Added amount is less than the expected amount");
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span>{numeral(amount).format("0,0.00")}</span>,
    },
    {
      title: "Reference #",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Check Date",
      dataIndex: "checkDate",
      key: "checkDate",
      render: (checkDate) => (
        <span>{checkDate && moment(checkDate).format("MM/DD/YYYY")}</span>
      ),
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "#",
      key: "remove",
      render: (txt, record) => (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => onRemove(record.id)}
        />
      ),
    },
  ];

  return (
    <CModal
      width={"60%"}
      title={"Add Payments"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="addPaymentForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <Row>
        <Col span={24}>
          <MyForm
            form={form}
            name="addPaymentForm"
            id="addPaymentForm"
            error={formError}
            onFinish={onSubmit}
            className="form-card"
          >
            <Row>
              <Col {...col3}>
                <FormInput
                  description={"Expected Amount"}
                  type="number"
                  name="amount"
                  formatter={(value) =>
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  initialValue={props?.amount}
                  placeholder="Amount"
                  disabled
                />
              </Col>
              <Col {...col3}>
                <FormSelect
                  description={"Receipt Type"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={"OR"}
                  name="receiptType"
                  field="receiptType"
                  placeholder="Receipt Type"
                  list={[
                    { value: "OR", label: "OR" },
                    { value: "SI", label: "SI" },
                  ]}
                />
              </Col>
              <Col {...col3}>
                <FormInput
                  description={"OR/SI Number"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="orNumber"
                  placeholder="OR/SI Number"
                />
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Payment for/Remarks"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="remarks"
                  placeholder="e.g Downpayment of xxxxx"
                />
              </Col>
            </Row>
          </MyForm>
        </Col>
        <Col span={24}>
          <Table
            size="small"
            columns={columns}
            dataSource={items}
            rowKey={(row) => row.id}
          />
        </Col>
        <Divider />
        <Col span={3}>
          <Button
            type="primary"
            block
            onClick={() => {
              if (amount != 0) {
                showModal({
                  show: true,
                  myProps: { type: "CASH", expected: amount },
                });
              }
            }}
          >
            Cash
          </Button>
        </Col>
        <Col span={3}>
          <Button
            type="primary"
            block
            onClick={() => {
              if (amount != 0) {
                showModal({
                  show: true,
                  myProps: { type: "CHECK", expected: amount },
                });
              }
            }}
          >
            Check
          </Button>
        </Col>
        <Col span={3}>
          <Button
            type="primary"
            block
            onClick={() => {
              if (amount != 0) {
                showModal({
                  show: true,
                  myProps: { type: "GCASH", expected: amount },
                });
              }
            }}
          >
            GCash
          </Button>
        </Col>
        <Col span={9}>
          <Text style={{ fontSize: 18 }}>
            Total Amount Tendered:{" "}
            <span style={{ color: "blue" }}>
              {numeral(_.sumBy(items, "amountTendered")).format("0,0.00")}
            </span>
          </Text>
        </Col>
        <Col span={6}>
          <Text style={{ fontSize: 18 }}>
            Change:{" "}
            <span style={{ color: "blue" }}>
              {numeral(
                _.sumBy(items, "amountTendered") - _.sumBy(items, "amount")
              ).format("0,0.00")}
            </span>
          </Text>
        </Col>
      </Row>
      {modal}
    </CModal>
  );
};

export default Payments;
