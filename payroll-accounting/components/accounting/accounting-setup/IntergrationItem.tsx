import { Query } from '@/graphql/gql/graphql'
import { gql, useQuery } from '@apollo/client'
import { Button, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Maybe } from 'graphql/jsutils/Maybe'
import JournalAccounts from './JournalAccounts'
import { useDialog } from '@/hooks'
import CreateIntegration from './integrations/createInteration'

export const INTEGRATION_PER_GROUP = gql`
  query ($id: UUID, $filter: String, $size: Int, $page: Int) {
    integrationGroupItemList(
      id: $id
      filter: $filter
      size: $size
      page: $page
    ) {
      content {
        id
        description
        flagValue
        orderPriority
        domain
      }
      totalPages
      size
      number
      totalElements
    }
  }
`

interface IntegrationProps {
  id: string
  description: Maybe<string> | undefined
}

const IntergrationItem = (props: IntegrationProps) => {
  const onCreateDialog = useDialog(CreateIntegration)
  const { data, loading, refetch } = useQuery(INTEGRATION_PER_GROUP, {
    variables: {
      id: props.id,
      filter: '',
      size: 10,
      page: 0,
    },
    notifyOnNetworkStatusChange: true,
  })

  const integrationgroupList = data?.integrationGroupItemList?.content as any

  const columns: ColumnsType<any> = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: 'Flag Value',
      dataIndex: 'flagValue',
      key: 'flagValue',
      width: 140,
      fixed: 'right',
    },
    {
      title: 'Order Priority',
      dataIndex: 'orderPriority',
      key: 'orderPriority',
      width: 130,
      fixed: 'right',
    },
  ]

  const onHandleClickCreateEdit = (record?: any) => {
    onCreateDialog({ integrationGroup: props.id, record: { ...record } }, () =>
      refetch()
    )
  }
  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Space>
        <Button onClick={() => onHandleClickCreateEdit()}>
          Add Integration
        </Button>
      </Space>
      <Table
        scroll={{ x: 1300 }}
        loading={loading}
        rowKey='id'
        size='small'
        bordered
        columns={columns}
        dataSource={integrationgroupList ?? []}
        expandable={{
          expandedRowRender: (record) => (
            <JournalAccounts id={record.id} domain={record?.domain} />
          ),
        }}
      />
    </Space>
  )
}

export default IntergrationItem
