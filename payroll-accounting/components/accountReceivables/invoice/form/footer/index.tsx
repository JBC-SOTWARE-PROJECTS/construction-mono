import {
  SubSummary,
  TotalSummary,
} from '@/components/accountReceivables/common/summaryComponent'
import { FormTextArea } from '@/components/common'
import { Col, Row, Space } from 'antd'
import Form, { FormInstance } from 'antd/es/form/Form'
import numeral from 'numeral'
import { AmountSummaryDetailI } from '..'

interface FormFooterI {
  form: FormInstance<any>
  invoiceType: string
  totalAmountSummary: AmountSummaryDetailI
}
export default function FormFooter(props: FormFooterI) {
  const { form, invoiceType, totalAmountSummary: summary } = props

  return (
    <Row style={{ marginTop: 25 }}>
      <Col flex={20}>
        <Form layout='vertical' form={form}>
          <FormTextArea
            name='notes'
            label='Remark on Invoice'
            style={{ fontWeight: 'bold' }}
            propstextarea={{
              style: { width: 300 },
              rows: 4,
              placeholder: 'This information will be visible on the invoice.',
            }}
          />
        </Form>
      </Col>
      <Col flex={2}>
        {invoiceType == 'REGULAR' && (
          <SubSummary
            {...{
              label: 'Subtotal',
              value: numeral(summary.subTotal).format('0,0.00'),
            }}
          />
        )}

        {invoiceType == 'PROJECT' && (
          <SubSummary
            {...{
              label: 'Subtotal HCI',
              value: numeral(summary.subTotalHCI).format('0,0.00'),
            }}
          />
        )}

        {invoiceType == 'PROJECT' && (
          <SubSummary
            {...{
              label: 'Subtotal PF',
              value: numeral(summary.subTotalPF).format('0,0.00'),
            }}
          />
        )}

        <SubSummary
          {...{
            label: 'Vat',
            value: numeral(summary.vatAmount).format('0,0.00'),
          }}
        />

        <SubSummary
          {...{
            label: 'Creditable Withholding Tax',
            value: numeral(summary.cwtAmount).format('0,0.00'),
          }}
        />

        <TotalSummary
          {...{
            label: 'TOTAL',
            value: numeral(summary.total).format('0,0.00'),
          }}
        />
      </Col>
    </Row>
  )
}
