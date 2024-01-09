import { Table } from 'antd'
import { SetStateType } from '../../commons/interface'
import { CreateLoanDataType } from '.'
import type { ColumnsType } from 'antd/es/table'
import numeral from 'numeral'
import dayjs from 'dayjs'

interface LoanAmortizationI {
  data: any
  loading: boolean
}

export default function LoanAmortization(props: LoanAmortizationI) {
  const columns: ColumnsType<any> = [
    {
      title: 'No',
      dataIndex: 'no',
      fixed: 'left',
      width: '50px',
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      width: '125px',
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
  ]

  return (
    <Table
      dataSource={props?.data?.loanMLoanPayments?.amortize ?? []}
      columns={columns}
      size='small'
      scroll={{ x: 1000 }}
    />
  )
}
