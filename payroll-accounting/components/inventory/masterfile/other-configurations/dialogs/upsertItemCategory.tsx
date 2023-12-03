import React from "react";
import { ItemCategory, Query } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
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
import {
  UPSERT_RECORD_ITEM_CATEGORY,
  GET_RECORDS_ACTIVE_ITEM_GROUP,
} from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ItemCategory | null | undefined;
}

export default function UpsertItemCategoryModal(props: IProps) {
  const { hide, record } = props;
  // ===================== Queries ==============================
  const { data } = useQuery<Query>(GET_RECORDS_ACTIVE_ITEM_GROUP, {
    fetchPolicy: "cache-and-network",
  });

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_ITEM_CATEGORY,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertItemCategory) {
          hide(data?.upsertItemCategory);
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
    payload.itemGroup = { id: values.itemGroup };
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
          } Item Category`}</Space>
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
          itemGroup: record?.itemGroup?.id ?? null,
          isActive: record?.isActive ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="categoryCode"
              rules={requiredField}
              label="Item Category Code"
              propsinput={{
                placeholder: "Item Category Code",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="categoryDescription"
              rules={requiredField}
              label="Item Category Description"
              propsinput={{
                placeholder: "Item Category Description",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              name="itemGroup"
              label="Item Group"
              rules={requiredField}
              propsselect={{
                options: _.get(data, "list", []),
                placeholder: "Select Item Group",
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
