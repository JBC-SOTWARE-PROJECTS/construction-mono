import CreateAccountingPeriod from '@/components/accounting/accounting-setup/createAccountingPeriod'
import CreateParentAccount from '@/components/accounting/accounting-setup/createParentAccount'
import AccountingSetupSideBar from '@/components/accounting/commons/sidebar'
import { Fiscal } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
import { Button, Input, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'

const GET_FISCAL = gql`
  query ($filter: String!, $page: Int!, $size: Int!) {
    fiscal: fiscals(filter: $filter, page: $page, size: $size) {
      content {
        id
        fiscalId
        fromDate
        toDate
        remarks
        active
        lockJanuary
        lockFebruary
        lockMarch
        lockApril
        lockMay
        lockJune
        lockJuly
        lockAugust
        lockSeptember
        lockOctober
        lockNovember
        lockDecember
      }
      totalPages
      size
      number
    }
  }
`

export default function ParentAccount() {
  const { data, loading, refetch } = useQuery(GET_FISCAL, {
    variables: {
      filter: '',
      page: 0,
      size: 10,
    },
  })

  const createDialog = useDialog(CreateParentAccount)

  const onHandleClickCreateEdit = (record?: Fiscal) => {
    createDialog({ record }, () => refetch())
  }

  const columns: ColumnsType<Fiscal> = [
    {
      title: 'Fiscal',
      dataIndex: 'fiscalId',
      key: 'fiscalId',
    },
    {
      title: 'Date from',
      dataIndex: 'fromDate',
      key: 'fromDate',
    },
    {
      title: 'Date to',
      dataIndex: 'toDate',
      key: 'toDate',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (text: string) => (text ? 'ACTIVE' : 'INACTIVE'),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
      render: (_: string, record: Fiscal) => (
        <Button type='primary' onClick={() => onHandleClickCreateEdit(record)}>
          Edit
        </Button>
      ),
    },
  ]
  return (
    <PageContainer
      title='Accounting Period'
      content='Seamlessly manage and configure your list of offices.'
      extra={[
        <Button
          key='add-fiscal'
          type='primary'
          onClick={() => onHandleClickCreateEdit()}
        >
          Add New Fiscal Year
        </Button>,
      ]}
    >
      <Space direction='vertical' style={{ width: '100%' }}>
        <Input.Search placeholder='Search here' />
        <Table
          rowKey='id'
          dataSource={data?.fiscal?.content ?? []}
          columns={columns}
          size='small'
          loading={loading}
        />
      </Space>
    </PageContainer>
  )
}
