import { FormDatePicker, FormInput, FormSelect } from "@/components/common"
import BankInput from "@/components/common/custom/bank-input"
import { cashieringMiscEWalletType } from "@/constant/cashier"
import useBankOpt, { useAcquisitionBankOpt } from "@/hooks/cashier/use-bank"
import { Button, Col, Form, Modal, Row, Space, Tag, Typography } from "antd"
import dayjs from "dayjs"
import { useState } from "react"

interface ModalProps {
  hide: (params: any) => void
}

export default function PaymentMethodEWallet(props: ModalProps) {
  const [form] = Form.useForm()

  const [otherType, setOtherType] = useState(false)
  const bankOpt = useAcquisitionBankOpt({ size: 100 })

  const onHandleFinish = (values: any) => {
    props.hide({
      ...values,
      type: "BANKDEPOSIT",
      checkdate: values.checkdate
        ? dayjs(values.checkdate).format("MM/DD/YYYY")
        : undefined,
      bankEntity: values.acquiringBank ? values.acquiringBank.value : undefined,
      bankEntityLabel: values.acquiringBank
        ? values.acquiringBank.label
        : undefined,
    })
  }

  return (
    <Modal
      title={
        <Typography.Title level={3}>
          <Space align="center">
            E-Wallet
            <Tag bordered={false} color="red">
              New
            </Tag>
          </Space>
        </Typography.Title>
      }
      open
      footer={null}
      onCancel={props.hide}
    >
      <Form
        layout="vertical"
        form={form}
        style={{ fontWeight: 600 }}
        onFinish={onHandleFinish}
      >
        <Row gutter={[4, 4]}>
          <Col span={11}>
            <FormInput
              name="terminalId"
              label="Terminal ID"
              rules={[{ required: true }]}
              propsinput={{ size: "large" }}
            />
          </Col>
          <Col span={12} offset={1}>
            <FormInput
              name="invoiceNo"
              label="Invoice No"
              rules={[{ required: true }]}
              propsinput={{
                size: "large",
              }}
            />
          </Col>
          <Col span={11}>
            <FormInput
              name="traceNo"
              label="Trace No"
              rules={[{ required: true }]}
              propsinput={{ size: "large" }}
            />
          </Col>
          <Col span={12} offset={1}>
            <FormInput
              name="reference"
              label="Card No"
              rules={[{ required: true }]}
              propsinput={{
                size: "large",
              }}
            />
          </Col>
          <Col span={11}>
            <FormInput
              name="approvalCode"
              label="Approval Code"
              rules={[{ required: true }]}
              propsinput={{ size: "large" }}
            />
          </Col>
          <Col span={12} offset={1}>
            <FormSelect
              name="acquiringBank"
              label="POS Bank"
              rules={[{ required: true }]}
              propsselect={{
                showSearch: true,
                options: bankOpt,
                size: "large",
                labelInValue: true,
              }}
            />
          </Col>
          <Col span={11}>
            <FormSelect
              name="eWalletType"
              label="Card Type"
              rules={[{ required: true }]}
              propsselect={{
                options: cashieringMiscEWalletType,
                size: "large",
                onSelect: (e) => setOtherType(e == "OTHERS"),
              }}
            />
          </Col>
          {otherType && (
            <Col span={12} offset={1}>
              <FormInput
                label="Other Card Type"
                name="otherType"
                rules={[{ required: true }]}
                propsinput={{ size: "large" }}
              />
            </Col>
          )}
          <Col flex={"100%"}>
            <BankInput
              name="amount"
              label="Amount"
              rules={[{ required: true }]}
              propsinputnumber={{
                size: "large",
              }}
            />
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
      </Form>
    </Modal>
  )
}
