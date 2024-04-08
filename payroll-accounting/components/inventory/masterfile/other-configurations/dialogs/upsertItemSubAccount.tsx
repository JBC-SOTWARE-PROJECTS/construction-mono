import React from "react";
import { ItemSubAccount } from "@/graphql/gql/graphql";
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
import { UPSERT_RECORD_ITEM_SUB_ACCOUNT } from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";
import { SOURCE_CLOUMN } from "@/utility/constant";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ItemSubAccount | null | undefined;
}

export default function UpsertItemSubAccountModal(props: IProps) {
  const { hide, record } = props;
  // ===================== Queries ==============================
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_ITEM_SUB_ACCOUNT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertItemSubAccount) {
          hide(data?.upsertItemSubAccount);
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    let payload = _.clone(values);
    payload.accountType = record?.accountType;

    if (
      record?.accountType === "FIXED_ASSET" ||
      record?.accountType === "FIXED_ASSET_EXPENSE"
    ) {
      payload.isFixedAsset = true;
    } else {
      payload.isFixedAsset = false;
    }

    if (record?.accountType === "REVENUE") {
      payload.isRevenue = true;
    } else {
      payload.isRevenue = false;
    }

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
          } Item Sub Account`}</Space>
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
          isActive: record?.isActive ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="subAccountCode"
              rules={requiredField}
              label="Item Sub Account Code"
              propsinput={{
                placeholder: "Item Sub Account Code",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="subAccountDescription"
              rules={requiredField}
              label="Item Sub Account Description"
              propsinput={{
                placeholder: "Item Sub Account Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              name="sourceColumn"
              label="Source Column"
              rules={requiredField}
              propsselect={{
                options: SOURCE_CLOUMN,
                placeholder: "Select Source Column",
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="isActive"
              valuePropName="checked"
              checkBoxLabel="Set as Active"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
