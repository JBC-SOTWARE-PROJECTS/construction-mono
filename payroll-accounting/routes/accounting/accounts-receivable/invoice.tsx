import { CardLayout } from '@/components/accountReceivables/common'
import CustomPageTitle from '@/components/accountReceivables/common/customPageTitle'
import { CommonTableCSS } from '@/components/accountReceivables/common/styles'
import {
  ActionInvoiceItem,
  CreateInvoiceMenu,
} from '@/components/accountReceivables/helper/invoice-landing-page'
import InvoiceForm from '@/components/accountReceivables/invoice/form'
import { invoiceTypeDetails } from '@/components/accountReceivables/invoice/form/helper'
import InvoiceViewing from '@/components/accountReceivables/invoice/viewing'
import PaymentTerminal from '@/components/accountReceivables/received-payments/dialog/payment-terminal'
import {
  InvoiceStatusColorEnum,
  InvoiceStatusLabelEnum,
} from '@/constant/accountReceivables'
import {
  INVOICE_PAGE,
  VOID_INVOICE,
} from '@/graphql/accountReceivables/invoices'
import { useDialog } from '@/hooks'
import ConfirmationPasswordHook from '@/hooks/promptPassword'
import { apiUrlPrefix } from '@/shared/settings'
import { InfoCircleOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@apollo/client'
import type { MenuProps } from 'antd'
import {
  Button,
  Dropdown,
  Pagination,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import numeral from 'numeral'

export default function Invoice() {
  const invoiceFormDialog = useDialog(InvoiceForm)
  const invoiceViewingDialog = useDialog(InvoiceViewing)
  const paymentDialog = useDialog(PaymentTerminal)
  const [showPasswordConfirmation] = ConfirmationPasswordHook()

  const [onRemoveInvoice, { loading: removeInvoiceLoading }] =
    useMutation(VOID_INVOICE)

  const { data, refetch, loading, fetchMore } = useQuery(INVOICE_PAGE, {
    variables: {
      customerId: null,
      search: '',
      page: 0,
      size: 10,
      status: 'ALL',
    },
  })

  const handleButtonClick = (record: any) => {
    paymentDialog({ type: 'OR' }, () => refetch())
  }

  const handleMenuClick = (key: string, record: any) => {
    const { id, invoiceType, status } = record
    switch (key) {
      case 'view-edit':
        if (['PENDING', 'PARTIALLY_PAID', 'PAID'].includes(status ?? ''))
          invoiceViewingDialog({ id }, () => {})
        else invoiceFormDialog({ invoiceType, id }, () => refetch())
        break
      case 'print':
        window.open(apiUrlPrefix + '/arreports/arinvoice?id=' + id, 'invoice')
        break
      case 'void':
        showPasswordConfirmation(() => {
          onRemoveInvoice({
            variables: { id },
            onCompleted: ({ invoice: { success, message: messageText } }) => {
              if (success) message.success(messageText)
              else message.error(messageText)
              refetch()
            },
          })
        })
        break
      case 'delete':
        break
      default:
        return null
    }
  }

  const handleCreateInvoiceMenuClick: MenuProps['onClick'] = ({
    key: invoiceType,
  }) => {
    invoiceFormDialog({ invoiceType }, () => refetch())
  }

  const handleCreateInvoiceClick = () => {
    invoiceFormDialog({ invoiceType: 'REGULAR' }, () => refetch())
  }

  const createMenuProps = {
    items: CreateInvoiceMenu,
    onClick: handleCreateInvoiceMenuClick,
  }

  const columns: ColumnsType<any> = [
    {
      title: 'INVOICE',
      dataIndex: 'invoiceNo',
      width: 150,
    },
    {
      title: 'ACCOUNT',
      dataIndex: ['arCustomer', 'customerName'],
      render: (text: string, record: any) => (
        <a
          href={`/accounting/accounts-receivable/clients/${record?.arCustomer?.id}/activities`}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'TYPE',
      dataIndex: 'invoiceType',
      width: 100,
      render: (text: any) => {
        const invoiceType =
          invoiceTypeDetails[text as keyof typeof invoiceTypeDetails]
        return (
          <Tag bordered={false} color={invoiceType.color}>
            {invoiceType.icon} {invoiceType.label}
          </Tag>
        )
      },
    },
    {
      title: 'DATE',
      dataIndex: 'invoiceDate',
      width: 100,
      render: (text) => dayjs(text).format('YYYY/MM/DD'),
    },
    {
      title: 'DUE DATE',
      dataIndex: 'dueDate',
      width: 100,
      render: (text) => dayjs(text).format('YYYY/MM/DD'),
    },
    {
      title: 'NET AMOUNT',
      dataIndex: 'totalAmountDue',
      width: 120,
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'BALANCE',
      dataIndex: 'netTotalAmount',
      align: 'right',
      width: 120,
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      width: 150,
      render: (text) => (
        <Typography.Text
          style={{
            color:
              InvoiceStatusColorEnum[
                text as keyof typeof InvoiceStatusColorEnum
              ],
          }}
        >
          <Space align='baseline'>
            <InfoCircleOutlined />
            {
              InvoiceStatusLabelEnum[
                text as keyof typeof InvoiceStatusLabelEnum
              ]
            }
          </Space>
        </Typography.Text>
      ),
    },
    {
      title: 'ACTION',
      dataIndex: 'id',
      align: 'right',
      fixed: 'right',
      width: 180,
      render: (text, record) => {
        return (
          <Dropdown.Button
            trigger={['click']}
            menu={{
              items: ActionInvoiceItem,
              onClick: ({ key }) => handleMenuClick(key, record),
            }}
            onClick={() => handleButtonClick(record)}
          >
            Collect Payment
          </Dropdown.Button>
        )
      },
    },
  ]

  const onSearch = (search: string) => {
    refetch({
      search,
      page: 0,
    })
  }

  return (
    <PageContainer
      title={
        <CustomPageTitle
          title='Invoices'
          subTitle='Document given to the buyer by the seller to collect payment.'
        />
      }
    >
      <CardLayout
        onSearch={onSearch}
        extra={<Button onClick={handleCreateInvoiceClick}>New Invoice</Button>}
      >
        <Table
          rowKey='id'
          columns={columns}
          dataSource={data?.invoices?.content ?? []}
          size='small'
          loading={loading}
          scroll={{ x: 1200 }}
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
