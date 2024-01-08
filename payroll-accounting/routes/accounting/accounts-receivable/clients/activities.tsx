import asyncComponent from '@/utility/asyncComponent'
import { ProCard } from '@ant-design/pro-components'
import { Table } from 'antd'
import Card from 'antd/es/card/Card'
import styled from 'styled-components'
import type { ColumnsType } from 'antd/es/table'
import { gql, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import numeral from 'numeral'

const AccountsProfileHeader = asyncComponent(
  () => import('@/components/accountReceivables/customers/accountsHeader')
)

interface AccountActivitiesI {
  id: string
}

const AR_LEDGER = gql`
  query ($customerId: UUID, $page: Int, $size: Int) {
    arLedger: arTransactionLedgerPage(
      customerId: $customerId
      page: $page
      size: $size
    ) {
      content {
        id
        ledgerDate
        docNo
        docType
        totalAmountDue
        remainingBalance
      }
    }
  }
`

export default function AccountActivities(props: AccountActivitiesI) {
  const { id } = props

  const { data, loading } = useQuery(AR_LEDGER, {
    variables: {
      customerId: id,
      page: 0,
      size: 10,
    },
  })

  const columns: ColumnsType<any> = [
    {
      title: 'DATE',
      dataIndex: 'ledgerDate',
      render: (text) => dayjs(text).format('YYYY/MM/DD'),
    },
    {
      title: 'DOC NO',
      dataIndex: 'docNo',
    },
    {
      title: 'DOC TYPE',
      dataIndex: 'docType',
    },
    {
      title: 'AMOUNT',
      dataIndex: 'totalAmountDue',
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'BALANCE',
      dataIndex: 'remainingBalance',
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
  ]
  return (
    <AccountsProfileHeader {...{ id, activeMenu: 'activities' }}>
      <ProCard
        headerBordered
        title='Activities'
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <InvoiceTableCSS>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={data?.arLedger?.content ?? []}
            size='small'
            loading={false}
            scroll={{ x: 1200 }}
          />
        </InvoiceTableCSS>
      </ProCard>
    </AccountsProfileHeader>
  )
}

const InvoiceTableCSS = styled.div`
  th.ant-table-cell {
    background: #fff !important;
    color: teal !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }
`
