import { FormInput, FormInputNumber, FormSelect } from "@/components/common"
import { cashieringCardType } from "@/constant/cashier"
import { useAcquisitionBankOpt } from "@/hooks/cashier/use-bank"
import { Button, Col, Form, Modal, Row, Space, Tag, Typography } from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import styled from "styled-components"

interface CashieringCard {
  amount: number
  reference: string
  checkdate: string
  bank: string
  nameOfCard: string
  approvalCode: string
  posTerminalId: string
  cardType: string
  otherType: string
  acquiringBank: string
}

interface ModalProps {
  hide: (record: any) => void
  amountTendered: number
}
export default function PaymentMethodCard({
  amountTendered,
  ...props
}: ModalProps) {
  const [form] = Form.useForm()

  const [otherType, setOtherType] = useState(false)
  const acquisitionBankOpt = useAcquisitionBankOpt({ size: 100 })

  console.log(acquisitionBankOpt, "acquisitionBankOpt")
  const handleExpirationChange = (e: any) => {
    let formattedValue = e?.target?.value ?? 0
    formattedValue = formattedValue.replace(/\D/g, "")
    // Limit to 6 characters
    formattedValue = formattedValue.slice(0, 4)

    // Insert '/' after the second character
    if (formattedValue.length > 2 && formattedValue.indexOf("/") === -1) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2)
    }
    form.setFieldValue("checkdate", formattedValue)
  }

  const onSubmit = (formData: any) => {
    const cardData = {
      type: "CARD",
      ...formData,
      cardType: formData.cardType
        ? otherType
          ? formData.otherType.toUpperCase()
          : formData.cardType
        : undefined,
      bankEntity: formData.acquiringBank
        ? formData.acquiringBank.value
        : undefined,
      bankEntityLabel: formData.acquiringBank
        ? formData.acquiringBank.label
        : undefined,
    }
    props.hide(cardData)
  }

  return (
    <Modal
      title={
        <Typography.Title level={3}>
          <Space align="center">
            Card
            <Tag bordered={false} color="red">
              New
            </Tag>
          </Space>
        </Typography.Title>
      }
      open
      onCancel={() => props.hide(null)}
      footer={null}
      style={{ fontWeight: "600" }}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{ amountTendered }}
        onFinish={onSubmit}
      >
        <Row gutter={[4, 4]}>
          <Col flex={"100%"}>
            <FormInput
              name="nameOfCard"
              label="Name on Card"
              rules={[{ required: true }]}
              propsinput={{ size: "large" }}
            />
          </Col>
          <Col flex={"100%"}>
            <FormInputNumber
              name="cardNumber"
              label="Card Number"
              rules={[{ required: true }]}
              propsinputnumber={{
                placeholder: "XXXX XXXX XXXX 0000",
                size: "large",
                formatter: (value) => {
                  const input = String(value).replace(/\D/g, "")
                  const formattedInput = input.replace(/(.{4})/g, "$1 ").trim()
                  return formattedInput
                },
              }}
            />
          </Col>
          <Col span={11}>
            <FormInput
              name="checkdate"
              label="Expiry Date"
              rules={[{ required: true }]}
              propsinput={{
                placeholder: "MM/YY",
                size: "large",
                onChange: (value) => handleExpirationChange(value),
              }}
            />
          </Col>
          <Col span={11} offset={2}>
            <FormInput
              name="approvalCode"
              label="Approval Code"
              rules={[{ required: true }]}
              propsinput={{
                size: "large",
              }}
            />
          </Col>
          <Col span={11}>
            <FormInputNumber
              name="terminalId"
              label="POS Terminal ID"
              rules={[{ required: true }]}
              propsinputnumber={{
                placeholder: "XXXX XXXX XXXX 0000",
                size: "large",
                formatter: (value) => {
                  const input = String(value).replace(/\D/g, "")
                  const formattedInput = input.replace(/(.{4})/g, "$1 ").trim()
                  return formattedInput
                },
              }}
            />
          </Col>
          <Col span={11} offset={2}>
            <FormSelect
              name="cardType"
              label="Card Type"
              rules={[{ required: true }]}
              propsselect={{
                options: cashieringCardType,
                size: "large",
                onSelect: (e) => setOtherType(e == "OTHERS"),
              }}
            />
          </Col>
          {otherType && (
            <Col flex="100%">
              <FormInput
                label="Other Card Type"
                name="otherType"
                rules={[{ required: true }]}
                propsinput={{ size: "large" }}
              />
            </Col>
          )}
          <Col flex={"100%"}>
            <FormSelect
              name="acquiringBank"
              label="Acquiring Bank"
              rules={[{ required: true }]}
              propsselect={{
                showSearch: true,
                options: acquisitionBankOpt,
                size: "large",
                labelInValue: true,
              }}
            />
          </Col>
          <Col flex={"100%"}>
            <InputCSS>
              <FormInputNumber
                name="amountTendered"
                label="Amount"
                rules={[{ required: true }]}
                propsinputnumber={{
                  size: "large",
                  formatter: (value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  parser: (value) =>
                    value?.replace(/\$\s?|(,*)/g, "") as unknown as number,
                }}
              />
            </InputCSS>
          </Col>
          <Col flex={"100%"}>
            <Button
              block
              size="large"
              type="primary"
              onClick={() => form.submit()}
              style={{ background: "#399b53" }}
            >
              Add
            </Button>
          </Col>
          <Col flex={"100%"}>
            <Button block size="large">
              Cancel
            </Button>
          </Col>
        </Row>
        <Row gutter={[8, 8]}></Row>
      </Form>
    </Modal>
  )
}

const InputCSS = styled.div`
  input {
    text-align: right !important;
    padding-right: 30px !important;
  }
`
