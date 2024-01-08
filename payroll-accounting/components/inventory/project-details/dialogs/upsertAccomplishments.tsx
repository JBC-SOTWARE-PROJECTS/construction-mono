import React, { useContext } from "react";
import { ProjectCost } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { accessControl, requiredField } from "@/utility/helper";
import {
  FormInput,
  FormTextArea,
  FormAutoComplete,
  FormDatePicker,
} from "@/components/common";
import dayjs from "dayjs";
import { UPSERT_RECORD_PROJECT_ACCOMPLISHMENT } from "@/graphql/inventory/project-queries";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { useWeathers } from "@/hooks/projects";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ProjectCost | null | undefined;
  projectId?: string;
}

export default function UpsertAccomplishmentReport(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, projectId } = props;
  const account = useContext(AccountContext);
  const [form] = Form.useForm();

  // ===================== Queries ==============================
  const weatherList = useWeathers();

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PROJECT_ACCOMPLISHMENT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertProjectUpdates?.success) {
          hide(data?.upsertProjectUpdates?.message);
        } else {
          message.error(data?.upsertProjectUpdates?.message);
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
    payload.status = "ACTIVE";
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
          } Accomplishment Report`}</Space>
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
          dateTransact: dayjs(),
          description: `DAILY ACCOMPLISHMENT REPORT ${dayjs().format(
            "MM/DD/YYYY"
          )}`,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormDatePicker
              label="Accomplishment Date"
              name="dateTransact"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
                disabled: accessControl(
                  account.user?.access || [],
                  "edit_accomplishment_date"
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
            <FormAutoComplete
              label="Weather"
              name="weather"
              rules={requiredField}
              propsinput={{
                options: weatherList,
                placeholder: "Weather",
              }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              label="Accomplishment"
              rules={requiredField}
              name="accomplishment"
              propstextarea={{
                rows: 4,
                placeholder: "Accomplishment",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
