import { Maybe, SubAccountSetup } from '@/graphql/gql/graphql'
import { gql, useQuery } from '@apollo/client'
import { Button, Input, Pagination, Space, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { AccountType } from '../enum/parentAccountEnum'

interface SubAccountTabPaneI {
  dataSource: never[] | Maybe<SubAccountSetup>[] | null | undefined
  loading: boolean
  onHandleClickCreateEdit: (record?: SubAccountSetup) => void
  onHandleSearch: (filter: string) => void
}

export default function SubAccountTabPane(props: SubAccountTabPaneI) {
  const columns: ColumnsType<SubAccountSetup> = [
    {
      title: 'Code',
      dataIndex: 'subaccountCode',
      key: 'subaccountCode',
      width: 200,
    },
    {
      title: 'Parent Account',
      dataIndex: ['parentAccount', 'accountName'],
      key: 'parentAccount',
      width: 350,
    },
    {
      title: 'Sub-account Name',
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
      dataIndex: 'subaccountType',
      key: 'subaccountType',
      width: 150,
      render: (text) => AccountType[text as keyof typeof AccountType].label,
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
      render: (_: string, record: SubAccountSetup) => (
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
            placeholder='Search sub-account name here'
            onSearch={(e) => props?.onHandleSearch(e)}
          />
        )}
        rowKey='id'
        dataSource={props?.dataSource as SubAccountSetup[]}
        columns={columns}
        size='small'
        loading={props?.loading}
      />
    </Space>
  )
}
