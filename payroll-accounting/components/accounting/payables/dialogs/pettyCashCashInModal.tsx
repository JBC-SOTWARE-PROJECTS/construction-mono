import React from "react";
import { App, Button, Col, Form, Modal, Row, Space, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { FormInput, FormTextArea } from "@/components/common";
import FormDatePicker from "@/components/common/formDatePicker/formDatePicker";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import { UPSERT_PETTY_CASH_CASH_IN } from "@/graphql/payables/petty-cash-queries";
import { requiredField } from "@/utility/helper";

export interface PettyCashCashInRecord {
  id?: string;
  transDate?: string;
  referenceNo?: string;
  description?: string;
  amount?: number;
  status?: string;
  posted?: boolean;
}

interface IProps {
  hide: (result?: { success: boolean; message: string } | false) => void;
  record?: PettyCashCashInRecord;
}

export default function PettyCashCashInModal({ hide, record }: IProps) {
  const { message } = App.useApp();
  const [upsert, { loading }] = useMutation(UPSERT_PETTY_CASH_CASH_IN);

  const onSubmit = (values: PettyCashCashInRecord) => {
    const fields = {
      ...values,
      // Send a calendar date at UTC midnight so the selected date does not shift
      // when a browser in Asia/Manila serializes the Dayjs value.
      transDate: values.transDate
        ? `${dayjs(values.transDate).format("YYYY-MM-DD")}T00:00:00.000Z`
        : undefined,
    };
    upsert({
      variables: { id: record?.id, fields },
      onCompleted: (data) => {
        if (data?.upsertPettyCashCashIn?.id) {
          hide({
            success: true,
            message: `Cash In successfully ${record?.id ? "updated" : "saved as draft"}.`,
          });
        }
      },
      onError: () => message.error("Unable to save the Cash In entry."),
    });
  };

  return (
    <Modal
      title={<Typography.Title level={4}>Cash In</Typography.Title>}
      destroyOnClose
      maskClosable={false}
      open
      width={600}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button onClick={() => hide(false)}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            form="pettyCashCashInForm"
            loading={loading}
            icon={<SaveOutlined />}>
            Save Cash In
          </Button>
        </Space>
      }>
      <Form
        name="pettyCashCashInForm"
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          transDate: record?.transDate ? dayjs(record.transDate) : dayjs(),
          referenceNo: record?.referenceNo,
          description: record?.description,
          amount: record?.amount,
        }}>
        <Row gutter={16}>
          <Col span={12}>
            <FormDatePicker
              name="transDate"
              label="Cash In Date"
              rules={requiredField}
              propsdatepicker={{ allowClear: false }}
            />
          </Col>
          <Col span={12}>
            <FormInputNumber
              name="amount"
              label="Amount"
              rules={requiredField}
              propsinputnumber={{ min: 0.01, className: "w-full" }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="referenceNo"
              label="Reference No."
              propsinput={{ placeholder: "Reference No." }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              name="description"
              label="Description"
              propstextarea={{ placeholder: "Reason or source of the Cash In" }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
