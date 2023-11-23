import { useDialog } from '@/hooks'
import { FilterOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import type { MenuProps } from 'antd'
import { Button, Card, Divider, Dropdown, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import numeral from 'numeral'
import styled from 'styled-components'
import InvoiceItemsForm from './dialog/invoiceItemForm'
import { CardLayout } from '../common'
import { CommonTableCSS } from '../common/styles'

const actionItems: MenuProps['items'] = [
  {
    label: 'Edit',
    key: 'edit',
  },
]

export const INVOICE_PARTICULAR_LIST_GQL = gql`
  query ($search: String, $page: Int, $size: Int) {
    particulars: findAllInvoiceParticulars(
      search: $search
      page: $page
      size: $size
    ) {
      content {
        id
        itemCode
        itemName
        description
        itemCategory
        salePrice
        salesAccountCode
      }
    }
  }
`

export default function InvoiceItems() {
  const formDialog = useDialog(InvoiceItemsForm)

  const { data, loading, refetch } = useQuery(INVOICE_PARTICULAR_LIST_GQL, {
    variables: {
      search: '',
      page: 0,
      size: 10,
    },
  })

  const onSearch = (search: string) => {
    refetch({
      search,
      page: 0,
    })
  }

  const onHandleClickRowMenu = (key: string, record: any) => {
    switch (key) {
      case 'edit':
        return formDialog({ id: record.id, record }, () => refetch())
      default:
        return null
    }
  }

  const onHandleClickNewItem = () => {
    formDialog({}, () => refetch())
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Code',
      dataIndex: 'itemCode',
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'itemName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Category',
      dataIndex: 'itemCategory',
    },

    {
      title: 'SALE PRICE',
      dataIndex: 'salePrice',
      width: 100,
      render: (text: string) => numeral(text).format('0,0.00'),
    },
    {
      title: ' ',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 50,
      render: (_, record: any) => {
        return (
          <Dropdown
            menu={{
              items: actionItems,
              onClick: ({ key }) => onHandleClickRowMenu(key, record),
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

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <CardLayout
        onSearch={onSearch}
        extra={
          <Button onClick={onHandleClickNewItem}>
            New Invoice Product/Service
          </Button>
        }
      >
        <CommonTableCSS>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={data?.particulars?.content ?? []}
            size='small'
            loading={loading}
            scroll={{ x: 1200 }}
          />
        </CommonTableCSS>
      </CardLayout>
    </Space>
  )
}

const TableCSS = styled.div`
  th.ant-table-cell {
    background: #fff !important;
    color: teal !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }
`
