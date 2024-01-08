import React, { useState } from "react";
import { Signature } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import _ from "lodash";
import { UPSERT_RECORD_SIGNATURES } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput } from "@/components/common";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Signature | null | undefined;
}

export default function UpsertSignatureModal(props: IProps) {
  const { hide, record } = props;
  const [currentUser, setCurrentUser] = useState(record?.currentUsers ?? false);
  // ===================== Queries ==============================
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_SIGNATURES,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertSignature) {
          hide(data?.upsertSignature);
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    const payload = _.clone(values);
    payload.signatureType = record?.signatureType;
    upsert({
      variables: {
        fields: payload,
        id: record?.id,
      },
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Signature`}</Space>
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
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
          currentUsers: record?.currentUsers ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="sequence"
              rules={requiredField}
              label="Sequence"
              propsinput={{
                placeholder: "Sequence",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="signatureHeader"
              rules={requiredField}
              label="Signature Header"
              propsinput={{
                placeholder: "Signature Header",
              }}
            />
          </Col>
          {!currentUser && (
            <Col span={24}>
              <FormInput
                name="signaturePerson"
                rules={requiredField}
                label="Signaturies"
                propsinput={{
                  placeholder: "Signaturies",
                }}
              />
            </Col>
          )}
          <Col span={24}>
            <FormInput
              name="signaturePosition"
              rules={requiredField}
              label="Position/Designation"
              propsinput={{
                placeholder: "Position/Designation",
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="currentUsers"
              valuePropName="checked"
              checkBoxLabel="is Current user ?"
              propscheckbox={{
                defaultChecked: false,
                onChange: (e) => {
                  setCurrentUser(e?.target?.checked)
                }
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
