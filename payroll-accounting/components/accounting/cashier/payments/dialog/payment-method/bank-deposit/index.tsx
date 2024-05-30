import { FormDatePicker, FormInput, FormSelect } from "@/components/common"
import BankInput from "@/components/common/custom/bank-input"
import useBankOpt from "@/hooks/cashier/use-bank"
import { Button, Col, Form, Modal, Row, Space, Tag, Typography } from "antd"
import dayjs from "dayjs"

interface ModalProps {
  hide: (params: any) => void
}

export default function PaymentMethodBankDeposit(props: ModalProps) {
  const [form] = Form.useForm()

  const bankOpt = useBankOpt({ size: 100 })

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
            Bank Deposit
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
          <Col flex={"100%"}>
            <FormSelect
              name="acquiringBank"
              label="Bank"
              rules={[{ required: true }]}
              propsselect={{
                showSearch: true,
                options: bankOpt,
                size: "large",
                labelInValue: true,
              }}
            />
          </Col>
          <Col flex={"100%"}>
            <FormInput
              name="reference"
              label="Remarks/Reference"
              propsinput={{ size: "large" }}
            />
          </Col>
          <Col flex={"100%"}>
            <FormDatePicker
              name="checkdate"
              label="Clearing Date"
              propsdatepicker={{ size: "large" }}
            />
          </Col>
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
