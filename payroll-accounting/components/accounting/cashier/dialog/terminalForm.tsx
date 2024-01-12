import React from "react";
import { Terminal, Query } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { requiredField } from "@/utility/helper";
import { FormInput, FormSelect } from "@/components/common";
import {
  GET_CASHIER_EMPLOYEE,
  UPSERT_RECORD_TERMINAL,
} from "@/graphql/cashier/queries";
import { OptionsValue } from "@/utility/interfaces";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Terminal | null | undefined;
}

export default function TerminalForm(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;
  const [form] = Form.useForm();

  // ===================== Queries ==============================
  const { loading, data } = useQuery<Query>(GET_CASHIER_EMPLOYEE, {
    variables: {
      role: "ROLE_CASHIER",
      filter: "",
    },
    fetchPolicy: "network-only",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_TERMINAL,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.addTerminal?.id) {
          if (record?.id) {
            hide("Cashier Terminal successfully updated");
          } else {
            hide("Cashier Terminal successfully added");
          }
        } else {
          message.error("Something went wrong. Please contact administrator.");
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (data: any) => {
    let payload = _.clone(data);
    payload.employee = { id: data.employee };
    upsertRecord({
      variables: {
        id: record?.id,
        fields: payload,
      },
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Terminal`}</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "500px" }}
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
          employee: record?.employee?.id ?? null,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              label={"Terminal No"}
              name="terminal_no"
              propsinput={{
                placeholder: "AUTO GENERATE",
                disabled: true,
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              label={"Description"}
              rules={requiredField}
              name="description"
              propsinput={{
                placeholder: "Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              label={"MAC Address"}
              rules={requiredField}
              name="mac_address"
              propsinput={{
                placeholder: "e.g 48-F1-7F-DB-CC-39",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label={"Assign Cashier"}
              rules={requiredField}
              name="employee"
              propsselect={{
                loading: loading,
                placeholder: "Assign Cashier",
                options: _.get(
                  data,
                  "searchEmployeesByRole",
                  []
                ) as OptionsValue[],
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
