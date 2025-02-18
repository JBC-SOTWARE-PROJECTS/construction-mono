import { FormDatePicker, FormInput } from "@/components/common"
import BankInput from "@/components/common/custom/bank-input"
import {
  Button,
  Col,
  Form,
  Grid,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
} from "antd"
import dayjs from "dayjs"

interface ModalProps {
  hide: (params: any) => void
}

interface CheckProps {}

export default function PaymentMethodCheck(props: ModalProps) {
  const [form] = Form.useForm()

  const onHandleFinish = (values: any) => {
    props.hide({
      ...values,
      type: "CHECK",
      checkdate: values.checkdate
        ? dayjs(values.checkdate).format("MM/DD/YYYY")
        : undefined,
    })
  }

  return (
    <Modal
      title={
        <Typography.Title level={3}>
          <Space align="center">
            Check
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
            <FormInput
              name="reference"
              label="Check No."
              propsinput={{ size: "large" }}
            />
          </Col>
          <Col flex={"100%"}>
            <FormInput
              name="bank"
              label="Bank"
              propsinput={{ size: "large" }}
            />
          </Col>
          <Col flex={"100%"}>
            <FormDatePicker
              name="checkdate"
              label="Check Date"
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
