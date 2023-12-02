import { Col, Form, Row } from 'antd'
import { CreditNCreateContextProps } from './CreditNCreate'
import { FormTextArea } from '@/components/common'
import {
  SubSummary,
  TotalSummary,
} from '@/components/accountReceivables/common/summaryComponent'
import numeral from 'numeral'

export default function CNSummary(props: CreditNCreateContextProps) {
  const { state, totalSummary } = props

  return (
    <Row style={{ marginTop: 25 }}>
      <Col flex={20}>
        <Form layout='vertical' form={props.form}>
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
        {state.invoiceType == 'REGULAR' && (
          <SubSummary
            label='Subtotal'
            value={numeral(totalSummary.subTotal).format('0,0.00')}
          />
        )}

        {state.invoiceType == 'CLAIMS' && (
          <SubSummary
            label='Subtotal HCI'
            value={numeral(totalSummary.subTotalHCI).format('0,0.00')}
          />
        )}

        {state.invoiceType == 'CLAIMS' && (
          <SubSummary
            label='Subtotal PF'
            value={numeral(totalSummary.subTotalPF).format('0,0.00')}
          />
        )}

        <SubSummary
          label='Vat'
          value={numeral(totalSummary.vatAmount).format('0,0.00')}
        />

        <SubSummary
          label='Creditable Withholding Tax'
          value={numeral(totalSummary.cwtAmount).format('0,0.00')}
        />

        <TotalSummary
          label='TOTAL'
          value={numeral(totalSummary.total).format('0,0.00')}
        />
      </Col>
    </Row>
  )
}
