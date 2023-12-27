import { CardLayout } from '@/components/accountReceivables/common'
import CreateLoan from '@/components/accounting/loan-management/create-loan'
import { CustomPageTitle } from '@/components/common/custom-components'
import { useDialog } from '@/hooks'
import { PlusCircleFilled } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
import { Button, Pagination, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import numeral from 'numeral'

const LOAN_QUERY = gql`
  query ($filter: String, $page: Int, $size: Int) {
    result: loanManagements(filter: $filter, page: $page, size: $size) {
      content {
        id
        loanNo
        referenceNo
        startDate
        bankAccount {
          id
          accountNumber
          bankname
        }
        loanAmount
        compoundType
        interestRate
        loanPeriod
        loanPayment
        totalInterest
        totalCostOfLoan
        remainingBalance
        paidPayments
        postedLedger
      }
      totalPages
      number
    }
  }
`

export default function Loans() {
  const createLoanDialog = useDialog(CreateLoan)

  const { data, loading, refetch, fetchMore } = useQuery(LOAN_QUERY, {
    variables: {
      filter: '',
      page: 0,
      size: 10,
    },
  })

  const { content, number, totalPages } = data?.result || {
    content: [],
    number: 0,
    totalPages: 10,
  }

  const handleSearch = (filter: string) => {
    refetch({ filter, page: 0 })
  }

  const handleNewRecord = () => {
    createLoanDialog({}, () => {})
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Loan No.',
      dataIndex: 'loanNo',
      width: 100,
      align: 'left',
    },
    {
      title: 'Loan date',
      dataIndex: 'startDate',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
      width: 100,
    },
    {
      title: 'Ref. No.',
      dataIndex: 'referenceNo',
      width: 100,
    },
    {
      title: 'Account No.',
      dataIndex: ['bankAccount', 'accountNumber'],
      width: 100,
    },
    {
      title: 'Bank Name',
      dataIndex: ['bankAccount', 'bankname'],
      width: 200,
    },
    {
      title: 'Compound Type',
      dataIndex: 'compoundType',
      width: 100,
    },
    {
      title: 'Loan amount',
      dataIndex: 'loanAmount',
      width: 140,
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interestRate',
      width: 100,
    },
    {
      title: 'Loan Period',
      dataIndex: 'loanPeriod',
      width: 100,
    },
    {
      title: 'Loan payment',
      dataIndex: 'loanPayment',
      width: 120,
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Total interest',
      dataIndex: 'totalInterest',
      width: 120,
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Cost of loan',
      dataIndex: 'totalCostOfLoan',
      width: 120,
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Balance',
      dataIndex: 'remainingBalance',
      width: 200,
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Action',
      dataIndex: 'itemName',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (text) => <Button type='primary'>Open</Button>,
    },
  ]
  return (
    <PageContainer
      title={
        <CustomPageTitle
          title='Loans'
          subTitle='Managing and Maximizing Registered Assets.'
        />
      }
    >
      <CardLayout
        onSearch={handleSearch}
        extra={
          <Space>
            <Button
              onClick={handleNewRecord}
              type='primary'
              icon={<PlusCircleFilled />}
            >
              New Loan
            </Button>
          </Space>
        }
      >
        <Table
          size='small'
          columns={columns}
          dataSource={content ?? []}
          scroll={{ x: 2200 }}
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
      </CardLayout>
    </PageContainer>
  )
}
