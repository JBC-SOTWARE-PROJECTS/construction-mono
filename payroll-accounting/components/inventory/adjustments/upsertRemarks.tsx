import React from "react";
import { QuantityAdjustment } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space, Typography, App } from "antd";
import _ from "lodash";
import { requiredField } from "@/utility/helper";
import { FormTextArea } from "@/components/common";
import { UPSERT_REMARKS_ADJUSTMENT } from "@/graphql/inventory/adjustments-queries";
import FormSelect from "@/components/common/formSelect/formSelect";
import { useAdjustmentTypes } from "@/hooks/inventory";

interface IProps {
  hide: (hideProps: any) => void;
  record: QuantityAdjustment;
}

export default function UpsertQuantityAdjustmentRemarks(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;
  const [form] = Form.useForm();
  // ===================== Queries ==============================
  const adjTypes = useAdjustmentTypes();
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_REMARKS_ADJUSTMENT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertAdjustmentRemarks?.id) {
          hide("Adjustment Remarks/Notes updated");
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

  const onSubmit = (data: QuantityAdjustment) => {
    upsertRecord({
      variables: {
        remarks: data.remarks,
        type: data.quantityAdjustmentType,
        id: record?.id,
      },
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">Quantity Adjustment Transaction</Space>
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
            form="upsertQuantityRemarks"
            loading={upsertLoading}
            icon={<SaveOutlined />}>
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="upsertQuantityRemarks"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
          quantityAdjustmentType: record?.quantityAdjustmentType?.id ?? null,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormSelect
              label="Adjustment Type"
              name="quantityAdjustmentType"
              rules={requiredField}
              propsselect={{
                options: adjTypes,
                allowClear: true,
                placeholder: "Select Adjustment Type",
              }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              label="Remarks/Notes (Particular)"
              name="remarks"
              rules={requiredField}
              propstextarea={{
                rows: 6,
                placeholder: "Remarks/Notes",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
