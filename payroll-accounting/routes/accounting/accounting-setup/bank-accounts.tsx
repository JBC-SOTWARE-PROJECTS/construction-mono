import { CardLayout } from '@/components/accountReceivables/common'
import CustomPageTitle from '@/components/accountReceivables/common/customPageTitle'
import { CreateInvoiceMenu } from '@/components/accountReceivables/helper/invoice-landing-page'
import InvoiceForm from '@/components/accountReceivables/invoice/form'
import CreateBankAccounts from '@/components/accounting/accounting-setup/dialog/create-bank-accounts'
import {
  InvoiceStatusColorEnum,
  InvoiceStatusLabelEnum,
} from '@/constant/accountReceivables'
import {
  INVOICE_PAGE,
  VOID_INVOICE,
} from '@/graphql/accountReceivables/invoices'
import { useDialog } from '@/hooks'
import {
  EditOutlined,
  InfoCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Dropdown, Pagination, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const BANK_PAGE = gql`
  query ($filter: String, $page: Int, $size: Int) {
    banks(filter: $filter, page: $page, size: $size) {
      content {
        id
        bankaccountId
        accountName
        bankname
        branch
        bankAddress
        accountNumber
        acquiringBank
      }
    }
  }
`

export default function BankAccounts() {
  const createDialog = useDialog(CreateBankAccounts)
  const [onRemoveInvoice, { loading: removeInvoiceLoading }] =
    useMutation(VOID_INVOICE)

  const { data, refetch, loading, fetchMore } = useQuery(BANK_PAGE, {
    variables: {
      filter: '',
      page: 0,
      size: 10,
    },
  })

  const handleMenuClick = (key: string, record: any) => {
    switch (key) {
      case 'edit':
        createDialog({ record }, () => refetch())
        break
      case 'delete':
        break
      default:
        return null
    }
  }

  const handleCreateInvoiceClick = () => {
    createDialog({}, () => refetch())
  }

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'bankaccountId',
      width: 100,
    },
    {
      title: 'Account #',
      dataIndex: 'accountNumber',
      width: 120,
    },
    {
      title: 'Account Name',
      dataIndex: 'accountName',
    },
    {
      title: 'Bank Name',
      dataIndex: 'bankname',
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      width: 250,
    },
    {
      title: 'Address',
      dataIndex: 'bankAddress',
      width: 350,
    },
    {
      title: ' ',
      dataIndex: 'id',
      align: 'right',
      fixed: 'right',
      width: 60,
      render: (text, record) => {
        return (
          <Dropdown
            key={'button-carret'}
            menu={{
              items: [
                {
                  label: 'Edit',
                  key: 'edit',
                  icon: <EditOutlined />,
                },
              ],
              onClick: ({ key }) => handleMenuClick(key, record),
            }}
            trigger={['click']}
          >
            <Button
              type='link'
              icon={<MoreOutlined />}
              size='large'
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>
        )
      },
    },
  ]

  const onSearch = (filter: string) => {
    refetch({
      filter,
      page: 0,
    })
  }

  return (
    <PageContainer
      title={
        <CustomPageTitle
          title='Bank Accounts'
          subTitle='Document given to the buyer by the seller to collect payment.'
        />
      }
    >
      <CardLayout
        onSearch={onSearch}
        extra={
          <Button onClick={handleCreateInvoiceClick}>New Bank Account</Button>
        }
      >
        <Table
          rowKey='id'
          columns={columns}
          dataSource={data?.banks?.content ?? []}
          size='small'
          loading={loading}
          scroll={{ x: 1600 }}
          pagination={false}
          footer={() => (
            <Pagination
              current={data?.payments?.number + 1}
              showSizeChanger={false}
              pageSize={10}
              responsive={true}
              total={data?.payments?.totalElements}
              onChange={(e) => {
                refetch({ page: e - 1 })
              }}
            />
          )}
        />
      </CardLayout>
    </PageContainer>
  )
}
