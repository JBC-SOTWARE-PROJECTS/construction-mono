import { ArrowRightOutlined, FieldTimeOutlined } from '@ant-design/icons'
import {
  Col,
  Descriptions,
  Divider,
  Form,
  Modal,
  Row,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import { invoiceTypeDetails, textStatus } from './form/helper'
import {
  FIND_ALL_INVOICE_ITEMS,
  FIND_ONE_INVOICE,
} from '@/graphql/accountReceivables/invoices'
import { gql, useQuery } from '@apollo/client'
import {
  ArAllocatedCreditNote,
  ArInvoice,
  ArInvoiceItems,
  ArPaymentPosting,
} from '@/graphql/gql/graphql'
import dayjs from 'dayjs'
import numeral from 'numeral'
import styled from 'styled-components'
import type { ColumnsType } from 'antd/es/table'
import Decimal from 'decimal.js'
import { SubSummary, TotalSummary } from '../common/summaryComponent'
import { FormTextArea } from '@/components/common'
import { CommonTableCSS } from '../common/styles'

const INVOICE_PAYMENTS = gql`
  query ($invoiceId: UUID) {
    payments: findInvoicePayments(invoiceId: $invoiceId) {
      id
      orNumber
      paymentAmount
    }
  }
`

const INVOICE_CREDIT_NOTE = gql`
  query ($invoiceId: UUID) {
    creditNote: findInvoiceCreditNote(invoiceId: $invoiceId) {
      id
      creditNoteNo
      creditNoteDate
      amountAllocate
    }
  }
`

interface InvoiceViewingI {
  hide: (value: any) => void
  id: string
}
export default function InvoiceViewing(props: InvoiceViewingI) {
  const { id } = props
  const {
    data: invoiceData,
    loading: findOneInvLoading,
    refetch: invoiceRefetch,
  } = useQuery(FIND_ONE_INVOICE, {
    variables: {
      id,
    },
  })

  const { data: paymentInvData, loading: paymentInvLoading } = useQuery(
    INVOICE_PAYMENTS,
    {
      variables: {
        invoiceId: id,
      },
    }
  )

  const { data: creditNoteInvData, loading: creditNoteInvLoading } = useQuery(
    INVOICE_CREDIT_NOTE,
    {
      variables: {
        invoiceId: id,
      },
    }
  )
  const {
    data: invoiceItemsData,
    loading: findAllInvItemLoading,
    refetch: invoiceItemRefetch,
  } = useQuery(FIND_ALL_INVOICE_ITEMS, {
    variables: {
      invoiceId: id,
    },
  })

  const {
    invoiceType,
    arCustomer,
    invoiceDate,
    dueDate,
    cwtAmount,
    vatAmount,
    reference,
    totalAmountDue,
    notes,
    netTotalAmount,
  }: ArInvoice = invoiceData?.findOne ?? { invoiceType: '' }

  const invoiceLabel =
    invoiceTypeDetails[invoiceType as keyof typeof invoiceTypeDetails]

  const columns: ColumnsType<ArInvoiceItems> = [
    {
      title: 'Transaction Date',
      dataIndex: 'transactionDate',
      className: 'DATE',
      width: 150,
      render: (text) => (text ? dayjs(text).format(' MM/DD/YYYY') : null),
    },
    {
      title: invoiceType == 'CLAIMS' ? 'Particular' : 'Product/Services',
      dataIndex: ['invoiceParticulars', 'itemName'],
      className: 'SEARCH',
      width: 300,
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      className: 'NUMBER',
      align: 'right',
      width: 100,
    },
    {
      title: 'Rate/Price',
      dataIndex: 'unitPrice',
      align: 'right',
      className: 'NUMBER',
      width: 150,
      render: (text) => new Decimal(text ?? 0).toString(),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmountDue',
      align: 'right',
      className: 'NUMBER',
      width: 180,
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Payment',
      dataIndex: 'totalPayments',
      align: 'right',
      className: 'NUMBER',
      width: 180,
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Balance',
      dataIndex: 'netTotalAmount',
      align: 'right',
      fixed: 'right',
      className: 'NUMBER',
      width: 180,
      render: (text) => numeral(text).format('0,0.00'),
    },
  ]

  return (
    <Modal
      title={
        findOneInvLoading ? (
          <Space.Compact direction='vertical'>
            <Skeleton.Input active={findOneInvLoading} />
            <Skeleton.Input active={findOneInvLoading} />
          </Space.Compact>
        ) : (
          <Space.Compact direction='vertical'>
            <Typography.Title level={4}>
              <Space align='baseline'>
                <FieldTimeOutlined />
                <b>
                  <Space>
                    <>Invoice</>
                    <Tag color={invoiceLabel.color} bordered={false}>
                      {invoiceLabel.icon} {invoiceLabel.label}
                    </Tag>
                  </Space>
                </b>
              </Space>
            </Typography.Title>
            <Typography.Text type='secondary' italic>
              Viewing Mode Only
            </Typography.Text>
          </Space.Compact>
        )
      }
      open={true}
      onCancel={() => props?.hide(false)}
      width={'100%'}
      style={{
        top: 20,
        border: 'none',
        boxShadow: 'none',
      }}
      maskStyle={{ background: '#f2f3f4' }}
      className='full-page-modal'
      footer={<></>}
    >
      <Space direction='vertical' style={{ width: '100%' }}>
        <Descriptions
          layout='vertical'
          column={{ xs: 1, sm: 2, md: 4, lg: 5, xl: 5, xxl: 6 }}
          size='small'
        >
          <Descriptions.Item label='To Client' span={24}>
            {arCustomer?.customerName}
          </Descriptions.Item>
          <Descriptions.Item label='Invoice Date'>
            {dayjs(invoiceDate).format('DD MMM, YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label='Due Date'>
            {dayjs(dueDate).format('DD MMM, YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label='Reference'>{reference}</Descriptions.Item>
          <Descriptions.Item label='Creditable Withholding Tax'>
            {numeral(cwtAmount).format('0,0.00')}
          </Descriptions.Item>
          <Descriptions.Item label='Vat'>
            {numeral(vatAmount).format('0,0.00')}
          </Descriptions.Item>
        </Descriptions>
        <CommonTableCSS>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={invoiceItemsData?.invoiceItems ?? []}
            size='small'
            loading={findAllInvItemLoading}
            scroll={{ x: 1600 }}
            pagination={false}
          />
        </CommonTableCSS>
        <Row style={{ marginTop: 25 }}>
          <Col flex={20}>
            <Form layout='vertical'>
              <FormTextArea
                name='notes'
                label='Remark on Invoice'
                style={{ fontWeight: 'bold' }}
                propstextarea={{
                  style: { width: 300 },
                  rows: 4,
                  placeholder:
                    'This information will be visible on the invoice.',
                  value: notes ?? '',
                  readOnly: true,
                }}
              />
            </Form>
          </Col>
          <Col flex={2}>
            {invoiceType == 'REGULAR' && (
              <SubSummary
                {...{
                  label: 'Subtotal',
                  value: numeral(totalAmountDue).format('0,0.00'),
                }}
              />
            )}

            <SubSummary
              {...{
                label: 'Vat',
                value: numeral(vatAmount).format('0,0.00'),
              }}
            />

            <SubSummary
              {...{
                label: 'Creditable Withholding Tax',
                value: numeral(cwtAmount).format('0,0.00'),
              }}
            />

            <TotalSummary
              {...{
                label: 'TOTAL',
                value: numeral(totalAmountDue).format('0,0.00'),
                style: {
                  borderBottom: 'none',
                  fontSize: '20px',
                },
              }}
            />

            <Space
              direction='vertical'
              style={{ marginTop: 20, marginBottom: 20, width: '100%' }}
            >
              {(paymentInvData?.payments ?? []).map(
                (payment: ArPaymentPosting) => (
                  <SubSummary
                    key={payment.id}
                    {...{
                      label: (
                        <Typography.Link>
                          {totalAmountDue == payment.paymentAmount
                            ? `Full payment -  OR# ${
                                payment.orNumber
                              } - ${dayjs(payment.paymentDatetime).format(
                                'D MMM YYYY'
                              )}`
                            : `Partial payment - OR# ${
                                payment.orNumber
                              } - ${dayjs(payment.paymentDatetime).format(
                                'D MMM YYYY'
                              )}`}
                        </Typography.Link>
                      ),
                      value: (
                        <Typography.Link>
                          {numeral(payment.paymentAmount).format('0,0.00')}
                        </Typography.Link>
                      ),
                    }}
                  />
                )
              )}
              {(creditNoteInvData?.creditNote ?? []).map(
                (creditNote: ArAllocatedCreditNote) => (
                  <SubSummary
                    key={creditNote.id}
                    {...{
                      label: (
                        <Typography.Link>
                          {`Credit Note # ${creditNote.creditNoteNo} - ${dayjs(
                            creditNote.creditNoteDate
                          ).format('D MMM YYYY')}`}
                        </Typography.Link>
                      ),
                      value: (
                        <Typography.Link>
                          {numeral(creditNote.amountAllocate).format('0,0.00')}
                        </Typography.Link>
                      ),
                    }}
                  />
                )
              )}
            </Space>

            {((paymentInvData?.payments ?? []).length > 0 ||
              (creditNoteInvData?.creditNote ?? []).length > 0) && (
              <TotalSummary
                {...{
                  label: 'AMOUNT DUE',
                  value: numeral(netTotalAmount).format('0,0.00'),
                  style: {
                    fontSize: '20px',
                  },
                }}
              />
            )}
          </Col>
        </Row>
      </Space>
    </Modal>
  )
}
