import { ParentAccount } from '@/graphql/gql/graphql'
import { gql, useQuery } from '@apollo/client'
import { Button, Input, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'

const PARENT_ACCOUNT = gql`
  query ($filter: String, $page: Int, $size: Int) {
    parentAccount: parentAccountPageable(
      filter: $filter
      page: $page
      size: $size
    ) {
      content {
        id
        code
        accountName
        description
        accountCategory
      }
    }
  }
`
interface ParentAccountTabPaneI {
  accountCategory?: String
}

export default function ParentAccountTabPane(props: ParentAccountTabPaneI) {
  const { data, loading } = useQuery(PARENT_ACCOUNT, {
    variables: {
      filter: '',
      page: '',
      size: '',
    },
  })

  const { content } = data?.parentAccount || { content: [] }

  const onHandleClickCreateEdit = (record: ParentAccount) => {}

  const columns: ColumnsType<ParentAccount> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Name',
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Category',
      dataIndex: 'accountCategory',
      key: 'accountCategory',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
      render: (_: string, record: ParentAccount) => (
        <Button type='primary' onClick={() => onHandleClickCreateEdit(record)}>
          Edit
        </Button>
      ),
    },
  ]

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Table
        title={() => <Input.Search placeholder='Search here' />}
        rowKey='id'
        dataSource={content}
        columns={columns}
        size='small'
        loading={loading}
      />
    </Space>
  )
}
