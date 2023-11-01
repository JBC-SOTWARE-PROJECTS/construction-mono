import {
  HeaderLedger,
  HeaderLedgerGroupItemsDto,
  Ledger,
} from '@/graphql/gql/graphql'
import { ProCard } from '@ant-design/pro-components'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { Descriptions, Table, DescriptionsProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import numeral from 'numeral'

interface LedgerListI {
  headerLedger: HeaderLedgerGroupItemsDto
}

const GET_ONE_HEADER_LEDGER = gql`
  query ($id: UUID, $transactionDateOnly: String) {
    findHeaderLedgerLedger(id: $id, transactionDateOnly: $transactionDateOnly) {
      id
      code
      description
      debit
      credit
    }
  }
`

export default function LedgerList(props: LedgerListI) {
  const { headerLedger } = props

  const { data, loading } = useQuery(GET_ONE_HEADER_LEDGER, {
    variables: {
      id: headerLedger?.id,
      transactionDateOnly: headerLedger?.transactionDateOnly,
    },
  })

  const content = data?.findHeaderLedgerLedger ?? []

  const columns: ColumnsType<Ledger> = [
    { title: 'Code', dataIndex: 'code' },
    { title: 'Account', dataIndex: 'description' },
    {
      title: 'Debit',
      dataIndex: 'debit',
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
  ]

  return (
    <ProCard>
      <Table
        title={() => 'Journal Accounts'}
        loading={loading}
        rowKey='id'
        columns={columns}
        dataSource={content}
        pagination={false}
      />
    </ProCard>
  )
}
