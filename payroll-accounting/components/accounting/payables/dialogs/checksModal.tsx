import React from "react";
import { InsertRowBelowOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import FormSelect from "@/components/common/formSelect/formSelect";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import {
  ICheckDetails,
  IFormDataCheckDetails,
} from "@/interface/payables/formInterfaces";
import { useBanks } from "@/hooks/payables";
import { DisbursementCheck } from "@/graphql/gql/graphql";
import { FormDatePicker, FormInput } from "@/components/common";
import dayjs from "dayjs";
import _ from "lodash";
import { randomId, requiredField, decimalRound2 } from "@/utility/helper";

interface IProps {
  hide: (hideProps: any) => void;
  record?: DisbursementCheck;
  status?: boolean;
}

export default function DisbursementChecksModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, status, record } = props;
  // ================== Queries =====================
  const banks = useBanks();
  //================== functions ====================
  const onSubmit = (data: IFormDataCheckDetails) => {
    if (Number(data.amount) <= 0) {
      return message.error("Check Amount must no be zero");
    } else {
      const payload: ICheckDetails = {
        bank: {
          id: data?.bank?.value ?? "",
          bankname: data?.bank?.label ?? "",
        },
        bankBranch: data.bankBranch,
        checkNo: data.checkNo,
        checkDate: data.checkDate,
        amount: decimalRound2(Number(data.amount)),
      };
      if (record?.id) {
        payload.id = record?.id;
      } else {
        payload.id = randomId();
        payload.isNew = true;
      }
      //save
      hide(payload);
    }
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <InsertRowBelowOutlined /> Check Details
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "550px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="addChecksForm"
            icon={<SaveOutlined />}>
            {record?.id ? "Save Changes" : "Add Check"}
          </Button>
        </Space>
      }>
      <Form
        name="addChecksForm"
        layout="vertical"
        onFinish={onSubmit}
        disabled={status ?? false}
        initialValues={{
          bank: record?.bank?.id
            ? { label: record?.bank?.bankname, value: record?.bank?.id }
            : null,
          bankBranch: record?.bankBranch,
          checkNo: record?.checkNo,
          checkDate: dayjs(record?.checkDate ?? new Date()),
          amount: record?.amount ?? 0,
        }}>
        <Row align="middle" gutter={[16, 0]}>
          <Col span={24}>
            <FormSelect
              label="Select Bank"
              name="bank"
              rules={requiredField}
              propsselect={{
                showSearch: true,
                labelInValue: true,
                options: banks ?? [],
                placeholder: "Select Bank",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              label="Bank Branch"
              name="bankBranch"
              propsinput={{
                placeholder: "Bank Branch",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              label="Check Number"
              name="checkNo"
              rules={requiredField}
              propsinput={{
                placeholder: "Check Number",
              }}
            />
          </Col>
          <Col span={24}>
            <FormDatePicker
              label="Check Date"
              name="checkDate"
              rules={requiredField}
              propsdatepicker={{
                placeholder: "Check Date",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Check Amount (Php)"
              name="amount"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Check Amount (Php)",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
