import { CardLayout } from '@/components/accountReceivables/common'
import CreateLoan from '@/components/accounting/loan-management/create-loan'
import ViewLoanDetails from '@/components/accounting/loan-management/view-loan'
import { CustomPageTitle } from '@/components/common/custom-components'
import { Loan } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import {
  CheckCircleOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  MoreOutlined,
  PlusCircleFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Button, Dropdown, Pagination, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { randomId } from '@/utility/helper'
import CommonJournalEntry from '@/components/accounting/commons/dialog/journal-entry'

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

const JOURNAL_ENTRY = gql`
  query ($id: UUID) {
    result: loanMViewPostingEntry(id: $id) {
      payload
      success
      message
    }
  }
`

const JOURNAL_POSTING = gql`
  mutation ($id: UUID, $entries: [Map_String_ObjectScalar]) {
    results: loanMPostEntry(id: $id, entries: $entries) {
      payload
      success
      message
    }
  }
`

export default function Loans() {
  const createLoanDialog = useDialog(CreateLoan)
  const showLoanDetails = useDialog(ViewLoanDetails)
  const journalEntryDialog = useDialog(CommonJournalEntry)

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

  const [onLoadJournalEntry] = useLazyQuery(JOURNAL_ENTRY)
  const [postPayment, { loading: postLoading }] = useMutation(JOURNAL_POSTING)

  const handleSearch = (filter: string) => {
    refetch({ filter, page: 0 })
  }

  const handleNewRecord = () => {
    createLoanDialog({}, () => {
      refetch({ page: 0 })
    })
  }

  const handleActionButton = (key: string, id: string) => {
    switch (key) {
      case 'post':
        onLoadJournalEntry({
          variables: {
            id: id,
          },
          onCompleted: ({ result }) => {
            const defaultAccounts = (result?.payload ?? []).map(
              (account: any) => ({
                ...account,
                id: randomId(),
              })
            )
            journalEntryDialog({ defaultAccounts }, (entries: any[]) => {
              console.log(entries, 'entries')
              if (entries.length > 0) {
                postPayment({
                  variables: {
                    id: id,
                    entries,
                  },
                  onCompleted: () => {
                    message.success('Successfully created.')
                    refetch()
                  },
                })
              }
            })
          },
        })
        break
      default:
        showLoanDetails({ id }, () => {})
        break
    }
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
      title: 'Posted',
      dataIndex: 'postedLedger',
      width: 50,
      align: 'center',
      fixed: 'right',
      render: (text) =>
        text ? (
          <Button
            type='text'
            style={{ color: 'green' }}
            icon={<CheckCircleOutlined />}
          />
        ) : (
          <Button
            type='text'
            style={{ color: 'blue' }}
            icon={<QuestionCircleOutlined />}
          />
        ),
    },
    {
      title: '#',
      dataIndex: 'id',
      width: 50,
      align: 'center',
      fixed: 'right',
      render: (text, record: Loan) => {
        const items = [
          {
            icon: <FolderOpenOutlined />,
            label: 'View',
            key: 'view',
          },
        ]

        if (!record?.postedLedger)
          items.push({
            icon: <CheckCircleOutlined />,
            label: 'Post',
            key: 'post',
          })

        return (
          <Dropdown
            key={'button-carret'}
            menu={{
              items,
              onClick: ({ key }) => handleActionButton(key, text),
            }}
            trigger={['click']}
          >
            <Button
              type='link'
              icon={<MoreOutlined />}
              size='large'
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>
        )
      },
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
