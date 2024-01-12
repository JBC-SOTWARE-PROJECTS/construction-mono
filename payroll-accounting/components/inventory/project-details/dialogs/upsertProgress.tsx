import React, { useContext } from "react";
import { ProjectProgress } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { accessControl, requiredField } from "@/utility/helper";
import {
  FormInput,
  FormTextArea,
  FormDatePicker,
  FormInputNumber,
} from "@/components/common";
import dayjs from "dayjs";
import { UPSERT_RECORD_PROJECT_PROGRESS } from "@/graphql/inventory/project-queries";
import { AccountContext } from "@/components/accessControl/AccountContext";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ProjectProgress | null | undefined;
  projectId?: string;
}

export default function UpsertProgressReport(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, projectId } = props;
  const account = useContext(AccountContext);
  const [form] = Form.useForm();

  // ===================== Queries ==============================
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PROJECT_PROGRESS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertProjectProgress?.success) {
          hide(data?.upsertProjectProgress?.message);
        } else {
          message.error(data?.upsertProjectProgress?.message);
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
    payload.project = projectId;
    upsertRecord({
      variables: {
        id: record?.id,
        date: dayjs(data?.dateTransact).format("YYYY-MM-DD"),
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
          } Progress Report`}</Space>
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
          dateTransact: record?.id ? dayjs(record?.dateTransact) : dayjs(),
          description: `PROGRESS REPORT ${
            record?.id
              ? dayjs(record?.dateTransact).format("MM/DD/YYYY")
              : dayjs().format("MM/DD/YYYY")
          }`,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormDatePicker
              label="Progress Report Date"
              name="dateTransact"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
                disabled: accessControl(
                  account.user?.access || [],
                  "edit_progress_date"
                ),
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="description"
              rules={requiredField}
              label="Description"
              propsinput={{
                placeholder: "Description",
                disabled: true,
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              name="progressPercent"
              rules={requiredField}
              label="Current Project Percentage (%)"
              propsinputnumber={{
                placeholder: "Current Project Percentage (%)",
                max: 100,
                disabled: record?.status === "LOCKED",
              }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              label="Progress Report"
              rules={requiredField}
              name="progress"
              propstextarea={{
                rows: 4,
                placeholder: "rogress Report",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
