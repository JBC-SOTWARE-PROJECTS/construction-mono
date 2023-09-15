import ChartOfAccountTabPane from '@/components/accounting/accounting-setup/chartOfAccountTabPane'
import CreateSubAccount from '@/components/accounting/accounting-setup/createSubAccount'
import { ParentAccount, Query, SubAccountSetup } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
import { Button, Tabs } from 'antd'

const SUB_ACCOUNT = gql`
  query ($filter: String, $accountCategory: AccountCategory) {
    subAccountByAccountType(
      filter: $filter
      accountCategory: $accountCategory
    ) {
      id
      subaccountCode
      accountName
      description
      subaccountType
      accountCategory
      parentAccount {
        id
        accountName
        description
      }
      sourceDomain
    }
  }
`

export default function SubAccount() {
  const { data, loading, refetch } = useQuery<Query>(SUB_ACCOUNT, {
    variables: {
      filter: '',
      accountCategory: null,
    },
  })

  const dataSource = data?.subAccountByAccountType || []

  const createDialog = useDialog(CreateSubAccount)

  const onHandleSearch = (filter: string) => {
    refetch({ filter, page: 0 })
  }

  const onHandleClickCreateEdit = (record?: SubAccountSetup) => {
    createDialog(
      { record: { ...record, parentAccount: record?.parentAccount?.id } },
      () => refetch()
    )
  }

  const onHandleChangeTab = (activeKey: string) => {
    if (activeKey == 'all') refetch({ accountCategory: null, page: 0 })
    else refetch({ accountCategory: activeKey, page: 0 })
  }

  const tabPaneProps = {
    dataSource,
    loading,
    onHandleClickCreateEdit,
    onHandleSearch,
  }

  return (
    <PageContainer
      title='Chart of Accounts'
      content='Overview of Chart of Accounts.'
      extra={[
        <Button
          key='add-fiscal'
          type='primary'
          onClick={() => onHandleClickCreateEdit()}
        >
          Add Sub-Account
        </Button>,
      ]}
    >
      <Tabs
        onChange={(activeKey) => onHandleChangeTab(activeKey)}
        defaultActiveKey='1'
        type='card'
        items={[
          {
            label: 'All Accounts',
            key: 'all',
            children: <ChartOfAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Assets',
            key: 'ASSET',
            children: <ChartOfAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Liabilities',
            key: 'LIABILITY',
            children: <ChartOfAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Equity',
            key: 'EQUITY',
            children: <ChartOfAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Expenses',
            key: 'EXPENSE',
            children: <ChartOfAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Revenue',
            key: 'REVENUE',
            children: <ChartOfAccountTabPane {...tabPaneProps} />,
          },
        ]}
      />
    </PageContainer>
  )
}
