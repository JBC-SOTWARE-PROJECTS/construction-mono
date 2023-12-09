import React, { useState } from "react";
import { SaveOutlined, TransactionOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Space, Typography } from "antd";
import FormSelect from "@/components/common/formSelect/formSelect";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import {
  IDisbursementExpense,
  IFormDisbursementExpense,
} from "@/interface/payables/formInterfaces";
import {
  useOffices,
  useExpenseTransaction,
  useProjects,
} from "@/hooks/payables";
import { FormTextArea } from "@/components/common";
import _ from "lodash";
import { randomId, requiredField, shapeOptionValue } from "@/utility/helper";
import { decimalRound2 } from "@/utility/helper";
import { ExpenseTransaction, Office, Projects } from "@/graphql/gql/graphql";

interface IProps {
  hide: (hideProps: any) => void;
  record?: IDisbursementExpense;
}

export default function DisbursementExpenseModal(props: IProps) {
  const { hide, record } = props;
  const [selectedOffice, setOffice] = useState("");
  const [form] = Form.useForm();
  const { setFieldValue } = form;
  // ================== Queries =====================
  const banks = useExpenseTransaction({ type: "DISBURSE" });
  const offices = useOffices();
  const projects = useProjects({ office: selectedOffice });
  //================== functions ====================
  const onSubmit = (data: IFormDisbursementExpense) => {
    const payload = {
      amount: data.amount,
      remarks: data.remarks,
    } as IDisbursementExpense;
    if (record?.id) {
      payload.id = record?.id;
    } else {
      payload.id = randomId();
    }
    payload.office = null;
    if (data.office) {
      payload.office = {
        id: data?.office?.value,
        officeDescription: data?.office?.label,
      } as Office;
    }
    payload.project = null;
    if (data.project) {
      payload.project = {
        id: data?.project?.value,
        description: data?.project?.label,
      } as Projects;
    }
    payload.transType = {
      id: data?.transType?.value,
      description: data?.transType?.label,
    } as ExpenseTransaction;
    payload.amount = decimalRound2(data?.amount);
    payload.isNew = true;
    hide(payload);
  };

  const selectInValueInit = (id?: string, type?: string) => {
    if (_.isEmpty(id)) {
      return null;
    } else {
      if (type === "office") {
        return shapeOptionValue(
          record?.office?.officeDescription,
          record?.office?.id
        );
      } else if (type === "transType") {
        return shapeOptionValue(
          record?.transType?.description,
          record?.transType?.id
        );
      }
    }
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <TransactionOutlined /> Expense Transactions
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
            form="expenseForm"
            icon={<SaveOutlined />}>
            {record?.id ? "Save Changes" : "Add Transaction"}
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="expenseForm"
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          transType: selectInValueInit(record?.transType?.id, "transType"),
          department: selectInValueInit(record?.office?.id, "office"),
          amount: record?.amount ?? 0,
          remarks: record?.remarks,
        }}>
        <Row align="middle" gutter={[16, 0]}>
          <Col span={24}>
            <FormSelect
              label="Transaction Types"
              name="transType"
              rules={requiredField}
              propsselect={{
                showSearch: true,
                labelInValue: true,
                options: banks ?? [],
                placeholder: "Select Transaction Types",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label="Office"
              name="office"
              propsselect={{
                showSearch: true,
                labelInValue: true,
                options: offices,
                placeholder: "Select Office",
                onChange: (e) => {
                  setOffice(e?.value);
                  setFieldValue("project", null);
                },
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label="Project"
              name="project"
              propsselect={{
                showSearch: true,
                labelInValue: true,
                options: projects,
                placeholder: "Select Project",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Amount (Php)"
              name="amount"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Amount (Php)",
              }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              label="Remarks/Notes"
              name="remarks"
              propstextarea={{
                rows: 4,
                placeholder: "Remarks/Notes",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
