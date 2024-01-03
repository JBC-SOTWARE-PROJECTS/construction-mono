import React from "react";

import { requiredField } from "@/utility/helper";
import { FormInput, FormInputNumber, FormSelect } from "@/components/common";
import { Button, Col, Form, message, Modal, Row, Space } from "antd";
import _ from "lodash";
import { SaveOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { UPSERT_ALLOWANCE_TYPE } from "@/graphql/company/queries";
import { AllowanceType } from "@/graphql/gql/graphql";
import { GET_COA_GEN_RECORDS } from "@/graphql/coa/queries";
import useGetChartOfAccounts from "@/hooks/useGetChartOfAccounts";
import FormCheckBox from "@/components/common/formCheckBox/formCheckBox";

interface typeProps {
  hide: (hideProps: any) => void;
  showModal: boolean;
  onCancel: any;
  record: any;
  refetch: any;
  expenses: any[];
}

interface allowanceTypeProps {
  id: string;
  name: string;
  type: string;
  amount: number;
}

function AllowanceTypeModal(props: typeProps) {
  const { hide, record, expenses } = props;
  const [form] = Form.useForm();
  const allowanceType = Form.useWatch("allowanceType", form);
  const [upsertAllowance, { loading }] = useMutation(UPSERT_ALLOWANCE_TYPE, {
    onCompleted: ({ data }) => {
      if (data?.success) {
        message.success("Successfully Added");
        hide(false);
      } else {
        message.error("Unsuccessfull!");
      }
    },
  });

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };
  const onSubmit = (values: allowanceTypeProps) => {
    upsertAllowance({
      variables: {
        id: record?.id ?? null,
        fields: values,
      },
    });
  };

  return (
    <div>
      <Modal
        title={`${record?.id ? "Edit" : "Add"} Allowance`}
        open
        destroyOnClose={true}
        maskClosable={false}
        onCancel={() => hide(false)}
        width={"100%"}
        style={{ maxWidth: "600px" }}
        footer={
          <Space>
            <Button
              type="primary"
              size="large"
              danger
              onClick={() => hide(false)}
              icon={<CloseCircleOutlined />}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              form="upsertForm"
              loading={loading}
              icon={<SaveOutlined />}
            >
              Save
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          name="upsertForm"
          layout="vertical"
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          initialValues={{
            name: record?.name || "",
            allowanceType: record?.allowanceType || "",
            amount: record?.amount || null,
            subaccountCode: record?.subaccountCode,
            isAttendanceBased: record?.isAttendanceBased,
          }}
        >
          <Row>
            <Col span={24}>
              <FormInput
                label="Name"
                name="name"
                rules={requiredField}
                propsinput={{
                  placeholder: "name",
                }}
              />
            </Col>
            <Col span={24}>
              <FormSelect
                label="Allowance Type"
                name="allowanceType"
                rules={requiredField}
                propsselect={{
                  options: Object.values(AllowanceType).map((item) => ({
                    value: item,
                    label: item.replace("_", " "),
                  })),
                  allowClear: true,
                  placeholder: "allowance type",
                }}
              />
            </Col>
            <Col span={24}>
              <FormSelect
                label="Sub Account"
                name="subaccountCode"
                rules={requiredField}
                propsselect={{
                  options: expenses?.map((item: any) => ({
                    value: item.code,
                    label: item.accountName.replace("_", " "),
                  })),
                  allowClear: true,
                  showSearch: true,
                  placeholder: "Sub Account",
                }}
              />
            </Col>
            <Col span={24}>
              <FormInputNumber
                label="Amount"
                name="amount"
                rules={requiredField}
                propsinputnumber={{
                  placeholder: "amount",
                }}
              />
            </Col>
            {allowanceType === "DAILY" && (
              <FormCheckBox
                name="isAttendanceBased"
                label="Attendance Based"
                valuePropName="checked"
                propscheckbox={{}}
              />
            )}
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default AllowanceTypeModal;
