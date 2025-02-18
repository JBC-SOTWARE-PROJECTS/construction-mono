import { FormInput, FormInputNumber } from "@/components/common"
import { PaymentItem } from "@/graphql/gql/graphql"
import { bankersRounding } from "@/utility/bank-utils"
import { Button, Col, Form, Modal, Row, Typography } from "antd"
import Decimal from "decimal.js"
import { useEffect, useRef } from "react"
import styled from "styled-components"

interface EditTerminalSelectedItemProps {
  hide: (amount?: number) => void
  record: PaymentItem
}
export default function EditTerminalSelectedItem({
  hide,
  ...props
}: EditTerminalSelectedItemProps) {
  const [form] = Form.useForm()
  const inputRef = useRef<HTMLInputElement>(null) // Create a ref for the input element

  useEffect(() => {
    // Focus on the input field when the modal is opened
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const onSubmit = () => {
    const fields = form.getFieldsValue()
    const newRecord = { ...props.record, ...fields }
    return hide(newRecord)
  }

  const onChangePrice = (price: number) => {
    console.log("Changing price..")
    const { qty } = form.getFieldsValue()
    const qtyDec = new Decimal(qty)
    const priceDec = new Decimal((price ?? 0).toString())

    const amount = qtyDec.times(priceDec).toString()
    form.setFieldValue("amount", parseFloat(amount))
  }

  const onChangeQty = (qty: number) => {
    const { price } = form.getFieldsValue()
    const qtyDec = new Decimal((qty ?? 0).toString())
    const priceDec = new Decimal((price ?? 0).toString())

    const amount = bankersRounding(
      parseFloat(qtyDec.times(priceDec).toString())
    )
    form.setFieldValue("amount", amount)
  }

  const onChangeAmount = (amount: number | string | null) => {
    const { qty } = form.getFieldsValue()
    const qtyDec = new Decimal((qty ?? 0).toString())

    const amountDec = new Decimal((amount ?? 0).toString())
    const priceDec = amountDec.dividedBy(qtyDec).toString()
    form.setFieldValue("price", parseFloat(priceDec))
  }

  return (
    <Modal centered open onCancel={() => hide()} footer={null}>
      <Form
        form={form}
        initialValues={{ ...props.record }}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Row gutter={[8, 8]}>
          <Col span={12} offset={6} style={{ textAlign: "center" }}>
            <Typography.Title level={5}>Edit Item</Typography.Title>
          </Col>
        </Row>
        <Row>
          <Col flex="100%">
            <FormInput
              name="itemName"
              label="Item Name"
              propsinput={{ size: "large", readOnly: true }}
            />
          </Col>
          <Col span={8}>
            <InputCSS>
              <FormInputNumber
                label="Quantity"
                name="qty"
                propsinputnumber={{
                  size: "large",
                  style: { width: "100%" },
                  autoFocus: true,
                  formatter: (value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  onChange: (value: any) => onChangeQty(value),
                  onPressEnter: onSubmit,
                }}
                ref={inputRef}
              />
            </InputCSS>
          </Col>
          <Col span={14} offset={2}>
            <InputCSS>
              <FormInputNumber
                label="Price"
                name="price"
                propsinputnumber={{
                  size: "large",
                  style: { width: "100%" },
                  autoFocus: true,
                  formatter: (value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  onChange: (value: any) => onChangePrice(value),
                  onPressEnter: onSubmit,
                }}
                ref={inputRef}
              />
            </InputCSS>
          </Col>
          <Col flex="100%">
            <InputCSS>
              <FormInputNumber
                label="Amount"
                name="amount"
                propsinputnumber={{
                  size: "large",
                  style: { width: "100%" },
                  autoFocus: true,
                  formatter: (value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  onChange: (value: number | string | null) =>
                    onChangeAmount(value),
                  onPressEnter: onSubmit,
                }}
                ref={inputRef}
              />
            </InputCSS>
          </Col>
          <Col flex="100%">
            <Button
              block
              size="large"
              type="primary"
              onClick={() => form.submit()}
            >
              Change
            </Button>
          </Col>
        </Row>
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
