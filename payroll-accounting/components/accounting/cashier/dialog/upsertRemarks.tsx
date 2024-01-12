import React from "react";
import { Shift } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { requiredField } from "@/utility/helper";
import { FormTextArea } from "@/components/common";
import { UPSERT_RECORD_REMARKS } from "@/graphql/cashier/queries";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Shift | null | undefined;
}

export default function UpsertShiftingRemarks(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;
  const [form] = Form.useForm();

  // ===================== Queries ==============================
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_REMARKS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.addRemarks?.id) {
          hide("Remarks/Notes updated");
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
    upsertRecord({
      variables: {
        remarks: payload.remarks,
        id: record?.id,
      },
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`Shifting Record Remarks/Notes`}</Space>
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
            <FormTextArea
              name="remarks"
              rules={requiredField}
              label="Remarks/Notes"
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
