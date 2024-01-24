import React from "react";
import { ProjectCost } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { decimalRound2, requiredField } from "@/utility/helper";
import {
  FormInput,
  FormTextArea,
  FormAutoComplete,
  FormInputNumber,
} from "@/components/common";
import { useProjectCostCategory, useProjectCostUnits } from "@/hooks/inventory";
import dayjs from "dayjs";
import {
  GET_PROJECT_BY_ID,
  UPSERT_RECORD_PROJECT_COST,
} from "@/graphql/inventory/project-queries";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ProjectCost | null | undefined;
  projectId?: string;
}

export default function UpsertProjectCost(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, projectId } = props;
  const [form] = Form.useForm();

  // ===================== Queries ==============================
  const categories = useProjectCostCategory();
  const units = useProjectCostUnits();

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PROJECT_COST,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertProjectCost?.success) {
          hide(data?.upsertProjectCost?.message);
        } else {
          message.error(data?.upsertProjectCost?.message);
        }
      },
      refetchQueries: [GET_PROJECT_BY_ID],
    }
  );

  //================== functions ====================

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (data: any) => {
    let payload = _.clone(data);
    payload.project = projectId;
    payload.dateTransact = dayjs();
    payload.category = _.trim(data.category);
    payload.unit = _.trim(data.unit);
    payload.status = true;
    if (Number(data?.cost) <= 0) {
      message.error("Invalid Cost! Cost must not be less than zero or zero");
    } else {
      upsertRecord({
        variables: {
          id: record?.id,
          fields: payload,
        },
      });
    }
  };

  const calculateTotal = (el: string, value: number) => {
    const { getFieldValue, setFieldValue } = form;
    if (el === "qty") {
      let cost = getFieldValue("cost");
      if (cost) {
        let total = cost * value;
        setFieldValue("totalCost", total);
      }
    } else {
      let qty = getFieldValue("qty");
      if (qty) {
        let total = qty * value;
        setFieldValue("totalCost", decimalRound2(total));
      }
    }
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">Add Bill of Quantities</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "600px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertForm"
            loading={upsertLoading}
            icon={<SaveOutlined />}>
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              label="Item No"
              rules={requiredField}
              name="itemNo"
              propsinput={{ placeholder: "Item No" }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              label="Description"
              rules={requiredField}
              name="description"
              propstextarea={{
                rows: 4,
                placeholder: "Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="refNo"
              rules={requiredField}
              label="Reference Number"
              propsinput={{
                placeholder: "Reference Number e.g A.1.1(6)",
              }}
            />
          </Col>
          <Col span={24}>
            <FormAutoComplete
              label="Category"
              name="category"
              rules={requiredField}
              propsinput={{
                options: categories,
                placeholder: "Category",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Qty"
              name="qty"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Qty",
                onChange: (e) => calculateTotal("qty", Number(e)),
              }}
            />
          </Col>
          <Col span={24}>
            <FormAutoComplete
              label="Unit"
              name="unit"
              rules={requiredField}
              propsinput={{
                options: units,
                placeholder: "Unit (e.g Month, each, lot)",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Unit Price"
              name="cost"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Unit Price",
                onChange: (e) => calculateTotal("cost", Number(e)),
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Relative Weight (%)"
              name="relativeWeight"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Relative Weight (e.g 1% - 100%)",
                max: 100,
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Total Cost"
              name="totalCost"
              rules={requiredField}
              propsinputnumber={{
                disabled: true,
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Total Cost",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
