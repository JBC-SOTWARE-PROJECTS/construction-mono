import CreateParentAccount from '@/components/accounting/accounting-setup/createParentAccount'
import ParentAccountTabPane from '@/components/accounting/accounting-setup/parentAccountTabPane'
import { AccountCategory, Fiscal } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
import { Button, Tabs } from 'antd'

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

  return (
    <PageContainer
      title='Parent Account'
      content='Seamlessly manage and configure your list of offices.'
      extra={[
        <Button
          key='add-fiscal'
          type='primary'
          onClick={() => onHandleClickCreateEdit()}
        >
          Add Parent Account
        </Button>,
      ]}
    >
      <Tabs
        defaultActiveKey='1'
        type='card'
        items={[
          {
            label: 'All Accounts',
            key: 'all',
            children: <ParentAccountTabPane />,
          },
          {
            label: 'Assets',
            key: 'assets',
            children: (
              <ParentAccountTabPane accountCategory={AccountCategory.Asset} />
            ),
          },
          {
            label: 'Liabilities',
            key: 'liabilities',
            children: 'Tab 3',
          },
          {
            label: 'Equity',
            key: 'equity',
            children: 'Tab 3',
          },
          {
            label: 'Expenses',
            key: 'expenses',
            children: 'Tab 3',
          },
          {
            label: 'Revenue',
            key: 'revenue',
            children: 'Tab 3',
          },
          {
            label: 'Archive',
            key: 'archive',
            children: 'Tab 3',
          },
        ]}
      />
    </PageContainer>
  )
}
