import { Card, Col, Form, Row } from 'antd'
import { ReceivePayCreateContextProps } from '.'
import { SubSummary } from '../../common/summaryComponent'
import numeral from 'numeral'
import Decimal from 'decimal.js'
import { FormTextArea } from '@/components/common'

export default function ReceivePaySummary(props: ReceivePayCreateContextProps) {
  const { cashierData, type, dispatch } = props

  return (
    <div style={{ padding: '20px 24px' }}>
      <Row style={{ marginBottom: 50 }}>
        <Col flex='auto'>
          <Form form={props.form} layout='vertical'>
            <FormTextArea name='notes' label='Notes' style={{ width: 400 }} />
          </Form>
        </Col>
        <Col flex='400px'>
          <Card bordered={false} style={{ backgroundColor: '#f9fafb' }}>
            <Row justify='end'>
              <Col flex='400px'>
                <SubSummary
                  {...{
                    label: 'Amount for Allocation',
                    value: numeral(props.totalPayment).format('0,0.00'),
                  }}
                />
              </Col>
            </Row>
            <Row justify='end'>
              <Col flex='400px'>
                <SubSummary
                  {...{
                    label: 'Amount for Crediting',
                    value: numeral(
                      new Decimal(props?.totalPayment ?? 0)
                        .minus(new Decimal(props?.totalTransactions ?? 0))
                        .toString()
                    ).format('0,0.00'),
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
