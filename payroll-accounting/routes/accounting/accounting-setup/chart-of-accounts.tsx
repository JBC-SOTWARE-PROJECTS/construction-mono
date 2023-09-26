import ChartOfAccountTabPane from '@/components/accounting/accounting-setup/chartOfAccountTabPane'
import CreateSubAccount from '@/components/accounting/accounting-setup/createSubAccount'
import {
  ChartOfAccountGenerate,
  ParentAccount,
  Query,
  SubAccountSetup,
} from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
import { Button, Tabs } from 'antd'

const CHART_OF_ACCOUNT = gql`
  query (
    $accountCategory: String
    $accountType: String
    $motherAccountCode: String
    $accountName: String
    $subaccountType: String
    $department: String
    $excludeMotherAccount: Boolean
  ) {
    getAllChartOfAccountGenerate(
      accountType: $accountType
      motherAccountCode: $motherAccountCode
      accountName: $accountName
      subaccountType: $subaccountType
      department: $department
      accountCategory: $accountCategory
      excludeMotherAccount: $excludeMotherAccount
    ) {
      code
      accountName
      accountType
      accountCategory
    }
  }
`

export default function SubAccount() {
  const { data, loading, refetch } = useQuery<Query>(CHART_OF_ACCOUNT, {
    variables: {
      accountType: null,
      motherAccountCode: null,
      accountName: '',
      subaccountType: null,
      department: null,
      accountCategory: null,
      excludeMotherAccount: true,
    },
  })

  const dataSource = data?.getAllChartOfAccountGenerate || []

  const createDialog = useDialog(CreateSubAccount)

  const onHandleSearch = (accountName: string) => {
    refetch({ accountName, page: 0 })
  }

  const onHandleClickCreateEdit = (record?: ChartOfAccountGenerate) => {}

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
