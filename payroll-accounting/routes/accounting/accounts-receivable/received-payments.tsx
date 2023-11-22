import { CardLayout } from '@/components/accountReceivables/common'
import CustomPageTitle from '@/components/accountReceivables/common/customPageTitle'
import { CommonTableCSS } from '@/components/accountReceivables/common/styles'
import PaymentTerminal from '@/components/accountReceivables/received-payments/dialog/payment-terminal'
import { useDialog } from '@/hooks'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
import { Button, Pagination, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import numeral from 'numeral'

const PAYMENT_PAGE = gql`
  query (
    $customerId: UUID
    $search: String
    $page: Int
    $size: Int
    $status: String
  ) {
    payments: findAllARPaymentPosting(
      customerId: $customerId
      search: $search
      page: $page
      size: $size
      status: $status
    ) {
      content {
        id
        arCustomerId
        recordNo
        orNumber
        customerName
        paymentDatetime
        paymentAmount
        referenceCn
        discountAmount
        status
      }
      totalElements
      number
      totalPages
    }
  }
`

export default function ReceivedPayments() {
  const paymentDialog = useDialog(PaymentTerminal)

  const { data, refetch, loading, fetchMore } = useQuery(PAYMENT_PAGE, {
    variables: {
      customerId: null,
      search: '',
      page: 0,
      size: 5,
      status: 'ALL',
    },
    fetchPolicy: 'cache-and-network',
  })

  const onNewPayment = () => {
    paymentDialog({ type: 'OR' }, () => {})
  }

  const columns: ColumnsType<any> = [
    {
      title: 'RECORD #',
      dataIndex: 'recordNo',
      width: 150,
    },
    {
      title: 'OR/AR #',
      dataIndex: 'orNumber',
      width: 80,
      render: (text) => String(text).padStart(5, '0'),
    },
    {
      title: 'ACCOUNT',
      dataIndex: 'customerName',
      render: (text: string, record) => (
        <a
          href={`/receivables-collections/accounts-receivable/clients/${record?.arCustomerId}/activities`}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'PAYMENT DATE',
      dataIndex: 'paymentDatetime',
      width: 150,
      render: (text) => dayjs(text).format('YYYY/MM/DD'),
    },
    {
      title: 'AMOUNT',
      dataIndex: 'paymentAmount',
      align: 'right',
      width: 150,
      render: (text) => numeral(text).format('0,0.00'),
    },
  ]

  const onSearch = (search: string) => {
    refetch({
      search,
      page: 0,
    })
  }

  return (
    <PageContainer
      title={
        <CustomPageTitle
          title='Received Payments'
          subTitle='Record of Inbound Transactions'
        />
      }
    >
      <CardLayout
        onSearch={onSearch}
        extra={<Button onClick={onNewPayment}>New Payment</Button>}
      >
        <CommonTableCSS>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={data?.payments?.content ?? []}
            size='small'
            loading={false}
            scroll={{ x: 1200 }}
            pagination={false}
            footer={() => (
              <Pagination
                current={data?.payments?.number + 1}
                showSizeChanger={false}
                pageSize={10}
                responsive={true}
                total={data?.payments?.totalElements}
                onChange={(e) => {
                  refetch({ page: e - 1 })
                }}
              />
            )}
          />
        </CommonTableCSS>
      </CardLayout>
    </PageContainer>
  )
}
