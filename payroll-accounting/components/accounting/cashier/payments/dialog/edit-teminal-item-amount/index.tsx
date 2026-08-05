import { FormInputNumber } from "@/components/common"
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from "antd"
import Decimal from "decimal.js"
import numeral from "numeral"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

interface EditTerminalItemAmountProps {
  hide: (amount?: number) => void
  amount: number
  tmpBalance: number
}
export default function EditTerminalItemAmount(
  props: EditTerminalItemAmountProps
) {
  const [form] = Form.useForm()
  const [balance, setBalance] = useState(props.tmpBalance - props.amount)
  const inputRef = useRef<HTMLInputElement>(null) // Create a ref for the input element

  useEffect(() => {
    // Focus on the input field when the modal is opened
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const onSubmit = (values: { amount: number }) => {
    if (balance < 0) return message.error("Invalid amount.")
    else return props.hide(values.amount)
  }

  const onChangeAmount = (amount: number | string | null) => {
    const bal = new Decimal(props?.tmpBalance ?? 0).minus(
      new Decimal(amount ?? 0)
    )
    setBalance(parseFloat(bal.toString()))
  }

  return (
    <Modal centered open onCancel={() => props.hide()} footer={null}>
      <Form form={form} initialValues={{ ...props }} onFinish={onSubmit}>
        <Row gutter={[8, 8]}>
          <Col span={12} offset={6} style={{ textAlign: "center" }}>
            <Typography.Title level={5}>Enter amount</Typography.Title>
          </Col>
        </Row>
        <Row>
          <Col flex="100%">
            <InputCSS>
              <FormInputNumber
                name="amount"
                validateStatus={balance < 0 ? "error" : "validating"}
                propsinputnumber={{
                  prefix: (
                    <Tag bordered={false} color="cyan">
                      {numeral(balance).format("0,0.00")}
                    </Tag>
                  ),
                  size: "large",
                  style: { width: "100%" },
                  autoFocus: true,
                  formatter: (value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  onChange: (value: number | string | null) =>
                    onChangeAmount(value),
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
