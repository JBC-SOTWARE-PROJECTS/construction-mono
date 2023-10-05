import { ChartOfAccountGenerate, Maybe } from '@/graphql/gql/graphql'
import { gql, useQuery } from '@apollo/client'
import { Button, Input, Pagination, Space, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { AccountCategory, AccountType } from '../enum/parentAccountEnum'

interface ChartOfAccountTabPaneI {
  dataSource: never[] | Maybe<ChartOfAccountGenerate>[] | null | undefined
  loading: boolean
  onHandleClickCreateEdit: (record?: ChartOfAccountGenerate) => void
  onHandleSearch: (filter: string) => void
}

export default function ChartOfAccountTabPane(props: ChartOfAccountTabPaneI) {
  const columns: ColumnsType<ChartOfAccountGenerate> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 350,
    },
    {
      title: 'Category',
      dataIndex: 'accountCategory',
      key: 'accountCategory',
      width: 150,
      render: (text) => AccountCategory[text as keyof typeof AccountCategory],
    },
    {
      title: 'Type',
      dataIndex: 'accountType',
      key: 'accountType',
      width: 150,
      render: (text) => AccountType[text as keyof typeof AccountType].label,
    },
  ]

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Table
        title={() => (
          <Input.Search
            placeholder='Search account name here'
            onSearch={(e) => props?.onHandleSearch(e)}
          />
        )}
        rowKey='code'
        dataSource={props?.dataSource as ChartOfAccountGenerate[]}
        columns={columns}
        size='small'
        loading={props?.loading}
        pagination={false}
      />
    </Space>
  )
}
