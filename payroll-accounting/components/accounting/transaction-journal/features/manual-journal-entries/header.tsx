import {
  FormDatePicker,
  FormInput,
  FormSelect,
  FormTextArea,
} from "@/components/common"
import {
  JournalDocTypeOpt,
  JournalTypeOpt,
} from "@/constant/transaction-journal"
import { FieldNumberOutlined, UserOutlined } from "@ant-design/icons"
import { Col, Form, Row } from "antd"
import dayjs from "dayjs"
import { ManualJournalEntriesContextProps } from "."

export default function MJEHeader(props: ManualJournalEntriesContextProps) {
  const loading = props?.loading?.findHeader
  const journalType = props?.journalType
  const readOnly = !!(
    !props?.state?.header?.custom || props?.state?.header?.approvedBy
  )

  return (
    <Form
      layout="vertical"
      form={props?.form}
      initialValues={{
        transactionDate: dayjs(),
        journalType: journalType != "ALL" ? journalType : "",
      }}
    >
      <Row gutter={[8, 8]}>
        <Col flex="300px">
          <FormInput
            label="Journal Reference No."
            name="invoiceSoaReference"
            hasFeedback
            propsinput={{ prefix: <FieldNumberOutlined />, readOnly }}
            rules={[{ required: true }]}
            {...{ loading }}
          />
        </Col>
        <Col flex={"auto"} />

        <Col flex={"200px"}>
          <FormDatePicker
            label="Transaction Date"
            name="transactionDate"
            propsdatepicker={{ showTime: true, disabled: readOnly }}
            rules={[{ required: true }]}
            {...{ loading }}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={"300px"}>
          <FormInput
            label="Entity"
            name="entityName"
            hasFeedback
            propsinput={{ prefix: <UserOutlined />, readOnly }}
            rules={[{ required: true }]}
            {...{ loading }}
          />
        </Col>
        <Col flex={"auto"} />
        <Col flex={"200px"}>
          <FormSelect
            label="Document Type"
            name="docType"
            propsselect={{ options: JournalDocTypeOpt, disabled: readOnly }}
            rules={[{ required: true }]}
            {...{ loading }}
          />
        </Col>
        <Col flex={"200px"}>
          <FormSelect
            label="Journal Type"
            name="journalType"
            propsselect={{ options: JournalTypeOpt, disabled: readOnly }}
            rules={[{ required: true }]}
            {...{ loading }}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={"auto"}>
          <FormTextArea
            label="Particular"
            name="particulars"
            hasFeedback
            propstextarea={{
              maxLength: 255,
              showCount: true,
              rows: 3,
              readOnly,
            }}
            rules={[{ required: true }]}
            {...{ loading }}
          />
        </Col>
      </Row>
    </Form>
  )
}
