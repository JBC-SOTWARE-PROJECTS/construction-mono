import React, { useState } from "react";
import { InsertRowBelowOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Space, Typography } from "antd";
import _ from "lodash";
import {
  decimalRound2,
  randomId,
  requiredField,
  shapeOptionValue,
} from "@/utility/helper";
import FormSelect from "@/components/common/formSelect/formSelect";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import { TAX_OPTIONS, responsiveColumn2 } from "@/utility/constant";
import FormSwitch from "@/components/common/formSwitch/formSwitch";
import { FormInput, FormTextArea } from "@/components/common";
import {
  ExtendedAPTransactionDto,
  IFormAPTransactionDetails,
} from "@/interface/payables/formInterfaces";
import {
  useAPTransactionType,
  useOffices,
  useProjects,
} from "@/hooks/payables";
import { Supplier } from "@/graphql/gql/graphql";

interface IProps {
  hide: (hideProps: any) => void;
  status?: boolean;
  record?: ExtendedAPTransactionDto;
  supplier?: Supplier;
}

export default function APDetailsModal(props: IProps) {
  const { hide, record, status, supplier } = props;
  const [form] = Form.useForm();
  const { setFieldValue } = form;
  const [selectedOffice, setOffice] = useState("");
  // ===================== Queries ==============================
  const transactionList = useAPTransactionType({
    type: supplier?.supplierTypes?.id,
    category: "AP",
  });
  const offices = useOffices();
  const projects = useProjects({ office: selectedOffice });
  //================== functions ====================

  const onSubmit = (data: IFormAPTransactionDetails) => {
    const payload = _.clone(data) as ExtendedAPTransactionDto;
    if (!record?.id) {
      payload.id = randomId();
      payload.isNew = true;
    } else {
      payload.id = record.id;
    }
    if (payload.office) {
      payload.office = {
        id: data?.office?.value,
        officeDescription: data?.office?.label,
      };
    }
    if (payload.transType) {
      payload.transType = {
        id: data?.transType?.value,
        description: data?.transType?.label,
      };
    }
    if (payload.project) {
      payload.project = {
        id: data?.project?.value,
        description: data?.project?.label,
      };
    }
    payload.taxDesc = data?.taxDesc?.label;
    hide(payload);
  };

  const calculateVatAmount = (
    vatInclusive: boolean,
    amount: number,
    discAmount: number,
    vatRate: number
  ) => {
    //calculate vat
    let vatAmount = vatInclusive
      ? ((amount - discAmount) / (vatRate + 1)) * vatRate
      : (amount - discAmount) * vatRate;
    setFieldValue("vatAmount", decimalRound2(vatAmount));
    //calculate vat
  };

  const calculateNet = async (
    vatInclusive: boolean,
    amount: number,
    discAmount: number,
    vatRate: number,
    ewt: number
  ) => {
    //calculate vat
    let vatAmount = vatInclusive
      ? ((amount - discAmount) / (vatRate + 1)) * vatRate
      : (amount - discAmount) * vatRate;
    //calculate vat
    let net = vatInclusive
      ? amount - discAmount - ewt
      : amount - discAmount + vatAmount - ewt;
    setFieldValue("netAmount", decimalRound2(net));
    //net amount
  };

  const calculateEwt = async (
    vatInclusive: boolean,
    amount: number,
    discAmount: number,
    vatRate: number,
    ewtRate: number
  ) => {
    let netOfdiscount = amount - discAmount;
    let ewt = 0;
    if (vatRate <= 0) {
      ewt = decimalRound2(netOfdiscount) * (ewtRate / 100);
      setFieldValue("ewtAmount", decimalRound2(ewt));
    } else {
      ewt = vatInclusive
        ? (netOfdiscount / (vatRate + 1)) * (ewtRate / 100)
        : netOfdiscount * (ewtRate / 100);
      setFieldValue("ewtAmount", decimalRound2(ewt));
    }
    setFieldValue("ewtRate", ewtRate);
    return decimalRound2(ewt);
  };

  const calculateAmount = async (el: string, value: number) => {
    const { getFieldsValue } = form;
    const data: IFormAPTransactionDetails = getFieldsValue();
    const vatRate = (record?.vatRate ?? 0) / 100;
    if (el === "amount") {
      let decimal = data.discRate / 100;
      //discount amount
      let disAmount = decimalRound2(value * decimal);
      setFieldValue("discAmount", disAmount);
      calculateVatAmount(data.vatInclusive, value, disAmount, vatRate);
      let ewt = await calculateEwt(
        data.vatInclusive,
        value,
        disAmount,
        vatRate,
        data.ewtRate
      );
      await calculateNet(data.vatInclusive, value, disAmount, vatRate, ewt);
      //
    } else if (el === "discRate") {
      let decimal = value / 100;
      //discount amount
      let disAmount = decimalRound2(data.amount * decimal);
      setFieldValue("discAmount", decimalRound2(disAmount));
      //end discount amount
      //calculate vat
      calculateVatAmount(data?.vatInclusive, data?.amount, disAmount, vatRate);
      let ewt = await calculateEwt(
        data.vatInclusive,
        data.amount,
        disAmount,
        vatRate,
        data?.ewtRate
      );
      await calculateNet(
        data.vatInclusive,
        data.amount,
        disAmount,
        vatRate,
        ewt
      );
      //calculate vat
    } else if (el === "discAmount") {
      let sprice = data?.amount - value;
      let discountRate = ((data?.amount - sprice) / data?.amount) * 100;
      setFieldValue("discRate", decimalRound2(discountRate));
      //calculate vat
      calculateVatAmount(data?.vatInclusive, data?.amount, value, vatRate);
      let ewt = await calculateEwt(
        data?.vatInclusive,
        data?.amount,
        value,
        vatRate,
        data?.ewtRate
      );
      await calculateNet(data?.vatInclusive, data?.amount, value, vatRate, ewt);
      //calculate vat
    } else if (el === "taxDesc") {
      let ewt = await calculateEwt(
        data?.vatInclusive,
        data?.amount,
        data?.discAmount,
        vatRate,
        value
      );
      await calculateNet(
        data?.vatInclusive,
        data?.amount,
        data?.discAmount,
        vatRate,
        ewt
      );
    }
  };

  const onChangeVatInclusive = async (value: boolean) => {
    const { getFieldsValue } = form;
    const data: IFormAPTransactionDetails = getFieldsValue();
    const vatRate = (record?.vatRate ?? 0) / 100;
    //calculate vat
    calculateVatAmount(value, data?.amount, data?.discAmount, vatRate);
    let ewt = await calculateEwt(
      value,
      data?.amount,
      data?.discAmount,
      vatRate,
      data?.ewtRate
    );
    await calculateNet(value, data?.amount, data?.discAmount, vatRate, ewt);
    //calculate vat
  };

  const selectInValueInit = (id?: string, type?: string) => {
    if (_.isEmpty(id)) {
      return null;
    } else {
      if (type === "transType") {
        return shapeOptionValue(
          record?.transType?.description,
          record?.transType?.id
        );
      } else if (type === "office") {
        return shapeOptionValue(
          record?.office?.officeDescription,
          record?.office?.id
        );
      } else if (type === "project") {
        return shapeOptionValue(
          record?.project?.description,
          record?.project?.id
        );
      } else if (type === "taxDesc") {
        return shapeOptionValue(record?.taxDesc, record?.ewtRate);
      }
    }
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <InsertRowBelowOutlined /> Accounts Payable Transaction Details
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "600px", top: 10 }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="detailsForm"
            icon={<SaveOutlined />}>
            {record?.id ? "Save Changes" : "Add Transaction"}
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="detailsForm"
        layout="vertical"
        onFinish={onSubmit}
        disabled={status ?? false}
        initialValues={{
          transType: selectInValueInit(record?.transType?.id, "transType"),
          office: selectInValueInit(record?.office?.id, "office"),
          project: selectInValueInit(record?.project?.id, "project"),
          amount: record?.amount ?? 0,
          discRate: record?.discRate ?? 0,
          discAmount: record?.discAmount ?? 0,
          vatAmount: record?.vatAmount ?? 0,
          vatInclusive: record?.vatInclusive ?? true,
          taxDesc: selectInValueInit(record?.taxDesc ?? "", "taxDesc"),
          ewtRate: record?.ewtRate ?? 0,
          ewtAmount: record?.ewtAmount ?? 0,
          netAmount: record?.netAmount ?? 0,
          refNo: record?.refNo,
          remarksNotes: record?.remarksNotes,
        }}>
        <Row align="middle" gutter={[16, 0]}>
          <Col span={24}>
            <FormSelect
              label="Transaction Types"
              name="transType"
              rules={requiredField}
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
                options: offices,
                placeholder: "Select Office",
                onChange: (e) => {
                  setOffice(e?.value);
                  setFieldValue("project", null);
                },
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
                options: projects,
                placeholder: "Select Project",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Amount (Php)"
              name="amount"
              rules={requiredField}
              propsinputnumber={{
                min: 0,
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Amount (Php)",
                onChange: (e) => calculateAmount("amount", Number(e)),
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Discount Rate (%)"
              name="discRate"
              rules={requiredField}
              propsinputnumber={{
                max: 100,
                min: 0,
                placeholder: "Discount Rate (%) e.g 10",
                onChange: (e) => calculateAmount("discRate", Number(e)),
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Discount Amount (Php)"
              name="discAmount"
              rules={requiredField}
              propsinputnumber={{
                min: 0,
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Discount Amount (Php)",
                onChange: (e) => calculateAmount("discAmount", Number(e)),
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormInputNumber
              label={`Vat Amount (${record?.vatRate}%)`}
              name="vatAmount"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                readOnly: true,
                placeholder: "Vat Amount (Php)",
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormSwitch
              label="Vat Inclusive ?"
              name="vatInclusive"
              valuePropName="checked"
              switchprops={{
                checkedChildren: "Yes",
                unCheckedChildren: "No",
                onChange: (e) => {
                  onChangeVatInclusive(e);
                },
                defaultChecked: false,
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label="Tax Description"
              name="taxDesc"
              propsselect={{
                allowClear: true,
                labelInValue: true,
                options: TAX_OPTIONS,
                placeholder: "Select Tax Description",
                onChange: (e) => {
                  calculateAmount("taxDesc", Number(e?.value ?? 0));
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
          <Col span={24}>
            <FormInputNumber
              label="Ewt Amount (Php)"
              name="ewtAmount"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                readOnly: true,
                placeholder: "Ewt Amount (Php)",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Net Amount (Php)"
              name="netAmount"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                readOnly: true,
                placeholder: "Net Amount (Php)",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              label="Reference No"
              name="refNo"
              propsinput={{
                placeholder: "Reference No",
              }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              label="Remarks/Notes"
              name="remarksNotes"
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
