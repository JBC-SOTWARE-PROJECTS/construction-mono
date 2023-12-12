import React from "react";
import { SaveOutlined, FundProjectionScreenOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import FormSelect from "@/components/common/formSelect/formSelect";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import {
  IDisbursementWTX,
  IFormDisbursementWTX,
} from "@/interface/payables/formInterfaces";
import _ from "lodash";
import { randomId, requiredField, shapeOptionValue } from "@/utility/helper";
import { decimalRound2 } from "@/utility/helper";
import { TAX_OPTIONS, responsiveColumn2, vatRate } from "@/utility/constant";
import FormSwitch from "@/components/common/formSwitch/formSwitch";

interface IProps {
  hide: (hideProps: any) => void;
  record?: IDisbursementWTX;
}

export default function DisbursementWTXModal(props: IProps) {
  const { hide, record } = props;
  const [form] = Form.useForm();
  const { setFieldValue } = form;
  //================== functions ====================
  const onSubmit = (data: IFormDisbursementWTX) => {
    const payload = {
      appliedAmount: data.appliedAmount,
      vatRate: data.vatRate,
      vatInclusive: data.vatInclusive,
      vatAmount: data.vatAmount,
      ewtRate: data.ewtRate,
      ewtAmount: data.ewtAmount,
      grossAmount: data.grossAmount,
      netAmount: data.netAmount,
    } as IDisbursementWTX;
    if (record?.id) {
      payload.id = record?.id;
    } else {
      payload.id = randomId();
    }
    if (data?.ewtDesc) {
      payload.ewtDesc = _.toString(data.ewtDesc?.label);
    }
    payload.ewtAmount = decimalRound2(data?.ewtAmount);
    payload.isNew = true;
    hide(payload);
  };

  const calculateVatAmount = (
    vatInclusive: boolean,
    amount: number,
    vatRate: number
  ) => {
    //calculate vat
    let vatAmount = vatInclusive
      ? (amount / (vatRate + 1)) * vatRate
      : amount * vatRate;
    setFieldValue("vatAmount", decimalRound2(vatAmount));
    return decimalRound2(vatAmount);
  };

  const calculateEwt = async (
    vatInclusive: boolean,
    amount: number,
    vatRate: number,
    ewtRate: number
  ) => {
    let netOfdiscount = decimalRound2(amount);
    let ewt = 0;
    if (vatRate <= 0) {
      ewt = netOfdiscount * (ewtRate / 100);
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
    const data: IFormDisbursementWTX = getFieldsValue();
    let vatRate = data.vatRate / 100;
    if (el === "appliedAmount") {
      let ewt = await calculateEwt(
        data.vatInclusive,
        value,
        vatRate,
        data.ewtRate
      );
      let vat = await calculateVatAmount(data?.vatInclusive, value, vatRate);
      let gross = value;
      let net = gross - ewt;
      if (data.vatInclusive) {
        setFieldValue("grossAmount", decimalRound2(gross));
        setFieldValue("netAmount", decimalRound2(net));
      } else {
        setFieldValue("grossAmount", decimalRound2(gross) + decimalRound2(vat));
        setFieldValue("netAmount", decimalRound2(net) + decimalRound2(vat));
      }
    } else if (el === "vatRate") {
      let ewt = await calculateEwt(
        data?.vatInclusive,
        data?.appliedAmount,
        value / 100,
        data?.ewtRate
      );
      let vat = await calculateVatAmount(
        data?.vatInclusive,
        data?.appliedAmount,
        value / 100
      );
      let gross = data.appliedAmount;
      let net = gross - ewt;
      if (data.vatInclusive) {
        setFieldValue("grossAmount", decimalRound2(gross));
        setFieldValue("netAmount", decimalRound2(net));
      } else {
        setFieldValue("grossAmount", decimalRound2(gross) + decimalRound2(vat));
        setFieldValue("netAmount", decimalRound2(net) + decimalRound2(vat));
      }
    } else if (el === "ewtDesc") {
      let ewt = await calculateEwt(
        data.vatInclusive,
        data.appliedAmount,
        vatRate,
        value
      );
      let gross = data.appliedAmount;
      let net = gross - ewt;
      if (data?.vatInclusive) {
        setFieldValue("grossAmount", decimalRound2(gross));
        setFieldValue("netAmount", decimalRound2(net));
      } else {
        setFieldValue(
          "grossAmount",
          decimalRound2(gross) + decimalRound2(data.vatAmount)
        );
        setFieldValue(
          "netAmount",
          decimalRound2(net) + decimalRound2(data.vatAmount)
        );
      }
    }
  };

  const onChangeVatInclusive = async (value: boolean) => {
    const { getFieldsValue } = form;
    const data: IFormDisbursementWTX = getFieldsValue();
    const vatRate = (data.vatRate ?? 0) / 100;
    //calculate vat
    let ewt = await calculateEwt(
      value,
      data.appliedAmount,
      vatRate,
      data?.ewtRate
    );
    let vat = await calculateVatAmount(value, data.appliedAmount, vatRate);
    let gross = data.appliedAmount;
    let net = gross - ewt;
    if (value) {
      setFieldValue("grossAmount", decimalRound2(gross));
      setFieldValue("netAmount", decimalRound2(net));
    } else {
      setFieldValue("grossAmount", decimalRound2(gross) + decimalRound2(vat));
      setFieldValue("netAmount", decimalRound2(net) + decimalRound2(vat));
    }

    //calculate vat
  };

  const selectInValueInit = (id?: string, type?: string) => {
    if (_.isEmpty(id)) {
      return null;
    } else {
      if (type === "ewtDesc") {
        return shapeOptionValue(record?.ewtDesc, record?.ewtRate);
      }
    }
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <FundProjectionScreenOutlined /> Expanding Withholding Tax
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "550px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="expenseForm"
            icon={<SaveOutlined />}>
            {record?.id ? "Save Changes" : "Add EWT"}
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="expenseForm"
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          appliedAmount: record?.appliedAmount ?? 0,
          vatRate: record?.vatRate ?? vatRate,
          vatInclusive: record?.vatInclusive ?? true,
          vatAmount: record?.vatAmount ?? 0,
          ewtDesc: selectInValueInit(record?.ewtDesc ?? "", "ewtDesc"),
          ewtRate: record?.ewtRate ?? 0,
          ewtAmount: record?.ewtAmount ?? 0,
          grossAmount: record?.grossAmount ?? 0,
          netAmount: record?.netAmount ?? 0,
        }}>
        <Row align="middle" gutter={[16, 0]}>
          <Col span={24}>
            <FormInputNumber
              label="Applied Amount (Php)"
              name="appliedAmount"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Applied Amount (Php)",
                onChange: (e) => calculateAmount("appliedAmount", Number(e)),
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormInputNumber
              label={`Vat Rate (%)`}
              name="vatRate"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                onChange: (e) => calculateAmount("vatRate", Number(e)),
                placeholder: "Vat Rate (%)",
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
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label={`Vat Amount (Php)`}
              name="vatAmount"
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                readOnly: true,
                placeholder: "Vat Amount (Php)",
              }}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              label="Tax Description"
              name="ewtDesc"
              rules={requiredField}
              propsselect={{
                allowClear: true,
                labelInValue: true,
                options: TAX_OPTIONS,
                placeholder: "Select Tax Description",
                onChange: (e) => {
                  calculateAmount("ewtDesc", Number(e?.value ?? 0));
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
              label="Gross Amount (Php)"
              name="grossAmount"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                readOnly: true,
                placeholder: "Gross Amount (Php)",
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
        </Row>
      </Form>
    </Modal>
  );
}
