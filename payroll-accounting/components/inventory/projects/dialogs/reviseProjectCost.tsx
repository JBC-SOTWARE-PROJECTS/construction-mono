import React, { useMemo } from "react";
import { ProjectCost } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { requiredField } from "@/utility/helper";
import {
  FormTextArea,
  FormAutoComplete,
  FormInputNumber,
} from "@/components/common";
import { useProjectCostUnits } from "@/hooks/inventory";
import dayjs from "dayjs";
import {
  GET_PROJECT_BY_ID,
  REVISE_RECORD_PROJECT_COST,
} from "@/graphql/inventory/project-queries";
import FormSelect from "@/components/common/formSelect/formSelect";
import { REVISIONS_COST } from "@/utility/constant";
import ConfirmationPasswordHook from "@/hooks/promptPassword";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ProjectCost | null | undefined;
}

export default function ReviseProjectCost(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;
  const [form] = Form.useForm();
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  // ===================== Queries ==============================
  const units = useProjectCostUnits();

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    REVISE_RECORD_PROJECT_COST,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.reviseProjectCost?.id) {
          hide("Revision Successfully saved.");
        } else {
          message.error("Something went wrong. Please contact administrator.");
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
    if (Number(data?.cost) <= 0) {
      message.error("Invalid Cost! Cost must not be less than zero or zero");
    } else {
      showPasswordConfirmation(() => {
        upsertRecord({
          variables: {
            id: record?.id,
            tag: payload.tagNo,
            fields: payload,
          },
        });
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
        setFieldValue("totalCost", total);
      }
    }
  };

  const index = useMemo(() => {
    let count = _.findIndex(REVISIONS_COST, ["value", record?.tagNo]);
    return count + 1;
  }, [record]);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">Revise Bill of Quantities</Space>
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
          tagNo: REVISIONS_COST[index].value,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormTextArea
              label="Description"
              rules={requiredField}
              name="description"
              propstextarea={{
                rows: 4,
                placeholder: "Description",
                disabled: true,
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
          <Col span={24}>
            <FormSelect
              name="tagNo"
              label="Revision Tag"
              rules={requiredField}
              propsselect={{
                options: REVISIONS_COST,
                placeholder: "Revision Tag",
                disabled: true,
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
