import React from "react";
import { SaveOutlined, TransactionOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Space, Typography } from "antd";
import FormSelect from "@/components/common/formSelect/formSelect";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import {
  PettyCashOthersDto,
  IFormPettyCashOthers,
} from "@/interface/payables/formInterfaces";
import { useOffices, useExpenseTransaction } from "@/hooks/payables";
import { FormTextArea } from "@/components/common";
import _ from "lodash";
import { randomId, requiredField, shapeOptionValue } from "@/utility/helper";
import { decimalRound2 } from "@/utility/helper";

interface IProps {
  hide: (hideProps: any) => void;
  record?: PettyCashOthersDto;
}

export default function PettyCashOtherModal(props: IProps) {
  const { hide, record } = props;
  // ================== Queries =====================
  const types = useExpenseTransaction({ type: "PETTYCASH" });
  const offices = useOffices();
  //================== functions ====================
  const onSubmit = (data: IFormPettyCashOthers) => {
    const payload = {
      amount: data.amount,
      remarks: data.remarks,
    } as PettyCashOthersDto;
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
      };
    }
    payload.project = null;
    if (data.project) {
      payload.project = {
        id: data?.project?.value,
        description: data?.project?.label,
      };
    }
    payload.transType = {
      id: data?.transType?.value,
      description: data?.transType?.label,
    };
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
      } else if (type === "project") {
        return shapeOptionValue(
          record?.project?.description,
          record?.project?.id
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
            <TransactionOutlined /> Petty Cash Others Transaction
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
        name="expenseForm"
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          transType: selectInValueInit(record?.transType?.id, "transType"),
          department: selectInValueInit(record?.office?.id, "office"),
          project: selectInValueInit(record?.project?.id, "project"),
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
                options: types ?? [],
                placeholder: "Select Transaction Types",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label="Offices"
              name="office"
              propsselect={{
                showSearch: true,
                labelInValue: true,
                options: offices,
                placeholder: "Select Offices",
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
                options: offices,
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
