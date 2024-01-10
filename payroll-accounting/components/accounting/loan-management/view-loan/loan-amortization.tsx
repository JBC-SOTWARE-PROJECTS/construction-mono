import { Loan } from '@/graphql/gql/graphql'
import { useConfirmationPasswordHook, useDialog } from '@/hooks'
import { randomId } from '@/utility/helper'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Button, Pagination, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import numeral from 'numeral'
import CommonJournalEntry from '../../commons/dialog/journal-entry'
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'

const LOAN_AMORTIZATION = gql`
  query ($id: UUID, $filter: String, $page: Int, $size: Int) {
    result: getLoanScheduleById(
      filter: $filter
      id: $id
      page: $page
      size: $size
    ) {
      content {
        id
        recordNo
        orderNo
        referenceNo
        paymentDate
        beginningBalance
        payment
        principal
        interest
        endingBalance
        postedLedger
      }
      totalElements
      totalPages
      size
      number
    }
  }
`

const JOURNAL_ENTRY = gql`
  query ($id: UUID) {
    result: loanMViewPaidLoan(id: $id) {
      payload
      success
      message
    }
  }
`

const JOURNAL_POSTING = gql`
  mutation ($id: UUID, $entries: [Map_String_ObjectScalar]) {
    results: loanMPaidLoan(id: $id, entries: $entries) {
      payload
      success
      message
    }
  }
`

const LOAN_CANCEL_PAYMENT = gql`
  mutation ($id: UUID) {
    loanMVoidPaidLoan(id: $id) {
      payload
      success
      message
    }
  }
`

interface LoanAmortizationI {
  id: string
}

export default function LoanAmortization(props: LoanAmortizationI) {
  const journalEntryDialog = useDialog(CommonJournalEntry)
  const [showPasswordConfirmation] = useConfirmationPasswordHook()

  const { data, loading, refetch, fetchMore } = useQuery(LOAN_AMORTIZATION, {
    variables: {
      id: props?.id,
      filter: '',
      page: 0,
      size: 10,
    },
  })

  const [postPayment, { loading: postLoading }] = useMutation(JOURNAL_POSTING)

  const [onLoadJournalEntry] = useLazyQuery(JOURNAL_ENTRY)

  const [voidPayment, { loading: voidPaymentLoading }] =
    useMutation(LOAN_CANCEL_PAYMENT)

  const { content, number, totalElements } = data?.result || {
    content: [],
    number: 0,
    totalElements: 10,
  }

  const handleJournalEntry = (id: string) => {
    showPasswordConfirmation(() => {
      onLoadJournalEntry({
        variables: {
          id,
        },
        onCompleted: ({ result }) => {
          const defaultAccounts = (result?.payload ?? []).map(
            (account: any) => ({
              ...account,
              id: randomId(),
            })
          )
          journalEntryDialog({ defaultAccounts }, (entries: any[]) => {
            postPayment({
              variables: {
                id,
                entries,
              },
              onCompleted: () => refetch(),
            })
          })
        },
      })
    })
  }

  const handleVoidPayment = (id: string) => {
    showPasswordConfirmation(() => {
      voidPayment({ variables: { id }, onCompleted: () => refetch() })
    })
  }

  const columns: ColumnsType<any> = [
    {
      title: 'No',
      dataIndex: 'orderNo',
      fixed: 'left',
      width: '50px',
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      width: '80px',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Beginning Balance',
      dataIndex: 'beginningBalance',
      align: 'right',
      width: '150px',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      align: 'right',
      width: '150px',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Principal',
      dataIndex: 'principal',
      align: 'right',
      width: '150px',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Interest',
      dataIndex: 'interest',
      align: 'right',
      width: '150px',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Ending Balance',
      dataIndex: 'endingBalance',
      fixed: 'right',
      align: 'right',
      width: '130px',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Action',
      dataIndex: 'postedLedger',
      fixed: 'right',
      align: 'center',
      width: '60px',
      render: (text, record: Loan) => {
        return !text ? (
          <Button
            type='primary'
            size='small'
            onClick={() => handleJournalEntry(record.id)}
          >
            Pay
          </Button>
        ) : (
          <Button
            type='primary'
            danger
            size='small'
            onClick={() => handleVoidPayment(record.id)}
          >
            Void
          </Button>
        )
      },
    },
  ]

  return (
    <Table
      dataSource={content ?? []}
      columns={columns}
      size='small'
      scroll={{ x: 1000 }}
      pagination={false}
      footer={() => (
        <Pagination
          current={number + 1}
          showSizeChanger={false}
          pageSize={10}
          responsive={true}
          total={totalElements}
          onChange={(e) => {
            refetch({ page: e - 1 })
          }}
        />
      )}
    />
  )
}
