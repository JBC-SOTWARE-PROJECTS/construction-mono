import React from "react";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Space, Typography } from "antd";
import _ from "lodash";
import FormSwitch from "@/components/common/formSwitch/formSwitch";
import FormSelect from "@/components/common/formSelect/formSelect";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import { TAX_OPTIONS } from "@/utility/constant";
import { IFormAPTransactionDetailsBulk } from "@/interface/payables/formInterfaces";
import { useAPTransactionType, useOffices } from "@/hooks/payables";
import { Supplier } from "@/graphql/gql/graphql";
import { requiredField } from "@/utility/helper";

interface IProps {
  hide: (hideProps: any) => void;
  status?: boolean;
  vatRate?: number;
  supplier?: Supplier;
}

export default function APDetailsBulkModal(props: IProps) {
  const { hide, vatRate, status, supplier } = props;
  const [form] = Form.useForm();
  const { setFieldValue } = form;
  // ===================== Queries ==============================
  const transactionList = useAPTransactionType({
    type: supplier?.supplierTypes?.id,
    category: "AP",
  });
  const departments = useOffices();
  //================== functions ====================

  const onSubmit = (data: IFormAPTransactionDetailsBulk) => {
    const payload = _.clone(data);
    payload.vatRate = vatRate;
    if (data?.office?.value) {
      payload.office = {
        id: data?.office?.value,
        officeDescription: data?.office?.label,
      };
    }
    if (data?.transType?.value) {
      payload.transType = {
        id: data?.transType?.value,
        description: data?.transType?.label,
      };
    }
    if (data?.project?.value) {
      payload.transType = {
        id: data?.project?.value,
        description: data?.project?.label,
      };
    }
    if (data?.taxDesc?.label) {
      payload.taxDesc = data?.taxDesc?.label;
    }
    hide(payload);
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <EditOutlined /> Accounts Payable Bulk Update Transactions
          </Space>
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
            form="detailsBulkForm"
            icon={<SaveOutlined />}>
            Apply Updates
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="detailsBulkForm"
        layout="vertical"
        onFinish={onSubmit}
        disabled={status ?? false}
        initialValues={{
          discAmount: 0,
          vatInclusive: true,
        }}>
        <Row align="middle" gutter={[16, 0]}>
          <Col span={24}>
            <FormSelect
              label="Transaction Types"
              name="transType"
              propsselect={{
                showSearch: true,
                labelInValue: true,
                options: transactionList ?? [],
                placeholder: "Select Transaction Types",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label="Office"
              name="office"
              propsselect={{
                showSearch: true,
                labelInValue: true,
                options: departments,
                placeholder: "Select Office",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label="Project"
              name="project"
              propsselect={{
                showSearch: true,
                labelInValue: true,
                options: departments,
                placeholder: "Select Project",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Discount Amount (Php)"
              name="discAmount"
              propsinputnumber={{
                min: 0,
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Discount Amount (Php)",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSwitch
              label="Vat Inclusive ?"
              name="vatInclusive"
              valuePropName="checked"
              switchprops={{
                checkedChildren: "Yes",
                unCheckedChildren: "No",
                defaultChecked: true,
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label="Tax Description"
              rules={requiredField}
              name="taxDesc"
              propsselect={{
                labelInValue: true,
                options: TAX_OPTIONS,
                placeholder: "Select Tax Description",
                onChange: (e) => {
                  setFieldValue("ewtRate", e?.value);
                },
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Ewt Rate (%)"
              name="ewtRate"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                readOnly: true,
                placeholder: "Ewt Rate (%)",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
