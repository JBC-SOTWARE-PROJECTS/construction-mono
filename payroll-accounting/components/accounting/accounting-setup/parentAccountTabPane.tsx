import { Maybe, ParentAccount } from '@/graphql/gql/graphql'
import { Button, Input, Pagination, Space, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { AccountType } from '../enum/parentAccountEnum'

interface ParentAccountTabPaneI {
  accountCategory?: string
  dataSource: never[] | Maybe<ParentAccount>[] | null | undefined
  loading: boolean
  totalElements: number
  number: number
  onHandleClickCreateEdit: (record?: ParentAccount) => void
  handleLoadMore: (page: number) => void
  onHandleSearch: (filter: string) => void
}

export default function ParentAccountTabPane(props: ParentAccountTabPaneI) {
  const columns: ColumnsType<ParentAccount> = [
    {
      title: 'Code',
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'accountName',
      key: 'accountName',
      render: (text, record) => (
        <Space direction='vertical' size={1}>
          <Typography.Text>{text}</Typography.Text>
          <p style={{ color: '#868686', fontSize: '11px' }}>
            {record.description}
          </p>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'accountCategory',
      key: 'accountCategory',
      width: 150,
    },
    {
      title: 'Type',
      dataIndex: 'accountType',
      key: 'accountType',
      width: 150,
      render: (text) => AccountType[text as keyof typeof AccountType].label,
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
      render: (_: string, record: ParentAccount) => (
        <Button
          type='primary'
          onClick={() => props.onHandleClickCreateEdit(record)}
        >
          Edit
        </Button>
      ),
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
        rowKey='id'
        dataSource={props?.dataSource as ParentAccount[]}
        columns={columns}
        size='small'
        loading={props?.loading}
        footer={() => (
          <Pagination
            defaultCurrent={1}
            current={props.number + 1}
            pageSize={10}
            responsive={true}
            total={props.totalElements}
            onChange={(page) => props.handleLoadMore(page - 1)}
          />
        )}
      />
    </Space>
  )
}
