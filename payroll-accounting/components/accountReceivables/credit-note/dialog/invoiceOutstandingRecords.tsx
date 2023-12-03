import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { gql, useQuery } from '@apollo/client'
import styled from 'styled-components'
import { useForm } from 'antd/lib/form/Form'
import { FormInput } from '@/components/common'

const PENDING_TRANSACTIONS = gql`
  query ($filter: String, $customerId: UUID, $filterType: String) {
    invoices: findAllInvoiceOutstandingBalForCreditNote(
      customerId: $customerId
      filterType: $filterType
      filter: $filter
    ) {
      id
      invoiceNo
      invoiceDate
      dueDate
      totalAmount
      totalAmountDue
      allocatedAmount
    }
  }
`

export interface ClientTransactionI {
  id: string
  invoiceNo: string
  invoiceDate: string
  dueDate: string
  totalAmount: number
  totalAmountDue: number
  allocatedAmount: number
}

const columns: ColumnsType<ClientTransactionI> = [
  {
    title: 'Invoice #',
    dataIndex: 'invoiceNo',
    width: '30%',
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    render: (text) => dayjs(text).format('YYYY/MM/DD'),
  },
  {
    title: 'Invoice Date',
    dataIndex: 'invoiceDate',
    render: (text) => dayjs(text).format('YYYY/MM/DD'),
  },
  {
    title: 'Total Amount',
    dataIndex: 'totalAmount',
    align: 'right',
    render: (text) => numeral(text).format('0,0.00'),
  },
  {
    title: 'Total Amount Due',
    dataIndex: 'totalAmountDue',
    align: 'right',
    render: (text) => numeral(text).format('0,0.00'),
  },
]

interface PendingInvoicesI {
  hide: (values: any) => void
  customerId: string
  transactions: ClientTransactionI[]
  invoiceType: string
  selected: string[]
  haBalance: boolean
}

export default function PendingInvoices(props: PendingInvoicesI) {
  const [form] = useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    props.selected ?? []
  )
  const [transactions, setTransactions] = useState<ClientTransactionI[]>(
    props.transactions ?? []
  )

  const { data, loading, refetch } = useQuery(PENDING_TRANSACTIONS, {
    variables: {
      customerId: props.customerId,
      filter: '',
      filterType: '',
    },
  })

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: any
  ) => {
    setSelectedRowKeys(newSelectedRowKeys)
    setTransactions(selectedRows)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const onHandleOk = ({ target }: any) => {
    refetch({ filter: target.value })
  }

  return (
    <Modal
      title='Pending Transactions'
      open
      okText='Add'
      onOk={() => props.hide(transactions)}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
      onCancel={() => props.hide(props.transactions ?? [])}
      width='80%'
    >
      <Space direction='vertical' style={{ width: '100%' }}>
        <Form form={form} layout='vertical'>
          <Row>
            <Col flex='300px'>
              <FormInput
                name='filter'
                label='Find Invoice No.'
                propsinput={{ size: 'large', onPressEnter: onHandleOk }}
              />
            </Col>
          </Row>
        </Form>
        <EditableTableCSS>
          <Table
            rowKey='id'
            size='small'
            rowSelection={rowSelection}
            columns={columns}
            loading={loading}
            dataSource={data?.invoices ?? []}
          />
        </EditableTableCSS>
      </Space>
    </Modal>
  )
}

const EditableTableCSS = styled.div`
  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 4px 0px;
    min-height: 30px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }

  th.ant-table-cell {
    border-radius: 0px !important;
    background: #fff !important;
    color: #000a1ebf !important;
    font-weight: bolder !important;
  }
`
