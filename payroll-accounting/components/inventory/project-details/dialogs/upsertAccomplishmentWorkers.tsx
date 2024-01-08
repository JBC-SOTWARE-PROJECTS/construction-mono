import React from "react";
import { ProjectUpdatesWorkers } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { requiredField } from "@/utility/helper";
import { FormSelect, FormTextArea } from "@/components/common";
import dayjs from "dayjs";
import { UPSERT_RECORD_PROJECT_WORKERS } from "@/graphql/inventory/project-queries";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import { useEmployeePositions } from "@/hooks/projects";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ProjectUpdatesWorkers | null | undefined;
  projectId?: string;
  projectUpdateId?: string;
}

export default function UpsertAccomplishmentWorkers(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, projectId, projectUpdateId } = props;
  const [form] = Form.useForm();
  // ===================== Queries ==============================
  const positions = useEmployeePositions();
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PROJECT_WORKERS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertProjectUpdatesWorkers?.success) {
          hide(data?.upsertProjectUpdatesWorkers?.message);
        } else {
          message.error(data?.upsertProjectUpdatesWorkers?.message);
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
    payload.projectUpdates = projectUpdateId;
    payload.dateTransact = dayjs();
    upsertRecord({
      variables: {
        id: record?.id,
        position: data?.position,
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
          } Number of Worker`}</Space>
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
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormSelect
              name="position"
              label="Position"
              rules={requiredField}
              propsselect={{
                options: positions,
                placeholder: "Select Position",
                disabled: !_.isEmpty(record?.id),
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              name="amShift"
              rules={requiredField}
              label="Total Workers in AM Shift"
              propsinputnumber={{
                placeholder: "Total Workers in AM Shift",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              name="pmShift"
              rules={requiredField}
              label="Total Workers in PM Shift"
              propsinputnumber={{
                placeholder: "Total Workers in PM Shift",
              }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              label="Remarks"
              name="remarks"
              propstextarea={{
                rows: 4,
                placeholder: "Remarks",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
