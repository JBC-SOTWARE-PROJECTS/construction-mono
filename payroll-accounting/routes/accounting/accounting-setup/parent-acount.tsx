import CreateParentAccount from '@/components/accounting/accounting-setup/createParentAccount'
import ParentAccountTabPane from '@/components/accounting/accounting-setup/parentAccountTabPane'
import { AccountType } from '@/components/accounting/enum/parentAccountEnum'
import {
  AccountCategory,
  Fiscal,
  ParentAccount,
  Query,
} from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
import { Button, Tabs } from 'antd'

const PARENT_ACCOUNT = gql`
  query (
    $filter: String
    $accountCategory: AccountCategory
    $page: Int
    $size: Int
  ) {
    parentAccountPageable(
      filter: $filter
      page: $page
      size: $size
      accountCategory: $accountCategory
    ) {
      content {
        id
        accountCode
        accountName
        description
        accountType
        accountCategory
      }
      number
      totalPages
      totalElements
    }
  }
`

export default function ParentAccount() {
  const { data, loading, refetch, fetchMore } = useQuery<Query>(
    PARENT_ACCOUNT,
    {
      variables: {
        filter: '',
        accountCategory: null,
        page: 0,
        size: 10,
      },
    }
  )

  const { content, number, totalElements } = data?.parentAccountPageable || {
    content: [],
    number: 0,
    totalElements: 0,
  }

  const createDialog = useDialog(CreateParentAccount)

  const onHandleClickCreateEdit = (record?: ParentAccount) => {
    createDialog({ record }, () => refetch())
  }

  const onHandleSearch = (filter: string) => {
    refetch({ filter, page: 0 })
  }

  const onHandleChangeTab = (activeKey: string) => {
    if (activeKey == 'all') refetch({ accountCategory: null, page: 0 })
    else refetch({ accountCategory: activeKey, page: 0 })
  }

  const handleLoadMore = (page: number) => {
    refetch({ page })
  }

  const tabPaneProps = {
    dataSource: content,
    loading,
    totalElements,
    onHandleClickCreateEdit,
    handleLoadMore,
    onHandleSearch,
  }

  return (
    <PageContainer
      title='Parent Account'
      content='Overview of Parent Account Details.'
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
        onChange={(activeKey) => onHandleChangeTab(activeKey)}
        defaultActiveKey='1'
        type='card'
        items={[
          {
            label: 'All Accounts',
            key: 'all',
            children: <ParentAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Assets',
            key: 'ASSET',
            children: <ParentAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Liabilities',
            key: 'LIABILITY',
            children: <ParentAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Equity',
            key: 'EQUITY',
            children: <ParentAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Expenses',
            key: 'EXPENSE',
            children: <ParentAccountTabPane {...tabPaneProps} />,
          },
          {
            label: 'Revenue',
            key: 'REVENUE',
            children: <ParentAccountTabPane {...tabPaneProps} />,
          },
        ]}
      />
    </PageContainer>
  )
}
