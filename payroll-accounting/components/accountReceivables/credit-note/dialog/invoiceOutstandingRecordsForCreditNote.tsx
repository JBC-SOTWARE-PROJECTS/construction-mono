import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { gql, useMutation, useQuery } from '@apollo/client'
import styled from 'styled-components'
import { useForm } from 'antd/lib/form/Form'
import { FormInput } from '@/components/common'
import {
  ADD_CREDIT_NOTE_ITEMS,
  REMOVE_CREDIT_NOTE_ITEM,
} from '@/graphql/accountReceivables/creditNote'

const PENDING_TRANSACTIONS = gql`
  query (
    $customerId: UUID
    $invoiceType: String
    $filter: String
    $filterType: String
    $hasBalance: Boolean
  ) {
    transactions: findAllInvoiceOutstandingBal(
      customerId: $customerId
      invoiceType: $invoiceType
      filter: $filter
      filterType: $filterType
      hasBalance: $hasBalance
    ) {
      id
      invoiceId
      customerId
      invoiceNo
      docNo
      particular
      itemType
      reference
      dueDate
      amount
      balance
      amountToApply: payment
    }
  }
`

const ADD_CLAIMS = gql`
  mutation ($creditNoteId: UUID, $invoiceItemId: UUID) {
    upsertCreditNoteClaimsItem(
      creditNoteId: $creditNoteId
      invoiceItemId: $invoiceItemId
    ) {
      response {
        id
      }
      message
      success
    }
  }
`

export interface ClientTransactionI {
  id: string
  customerId: string
  particular: string
  dueDate: string
  amount: number
  balance: number
  payment: number
}

const columns: ColumnsType<ClientTransactionI> = [
  {
    title: 'INVOICE #',
    dataIndex: 'invoiceNo',
    width: 150,
  },
  {
    title: 'RECORD #',
    dataIndex: 'docNo',
    width: 100,
  },
  {
    title: 'PARTICULAR',
    dataIndex: 'particular',
  },
  {
    title: 'TYPE',
    dataIndex: 'itemType',
  },
  {
    title: 'REFERENCE',
    dataIndex: 'reference',
  },
  {
    title: 'DUE DATE',
    dataIndex: 'dueDate',
    width: 150,
    render: (text) => dayjs(text).format('YYYY/MM/DD'),
  },

  {
    title: 'AMOUNT',
    dataIndex: 'amount',
    width: 150,
    align: 'right',
    render: (text) => numeral(text).format('0,0.00'),
  },

  {
    title: 'BALANCE',
    dataIndex: 'balance',
    width: 150,
    align: 'right',
    render: (text) => numeral(text).format('0,0.00'),
  },
]

interface InvoiceOutstandingRecordsI {
  hide: (values: any) => void
  creditNoteId: string
  customerId: string
  transactions: ClientTransactionI[]
  invoiceType: string
  selected: string[]
  haBalance: boolean
}

export default function InvoiceOutstandingRecordsForCreditNote(
  props: InvoiceOutstandingRecordsI
) {
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
      invoiceType: props.invoiceType,
      haBalance: props.haBalance ?? true,
    },
  })

  const [onAddClaims, { loading: onAddClaimsLoading }] = useMutation(ADD_CLAIMS)

  const [onUpdateItem, { loading: loadingInsert }] = useMutation(
    ADD_CREDIT_NOTE_ITEMS
  )

  const [onRemoveCreditItem, { loading: removeCreditNoteItemLoading }] =
    useMutation(REMOVE_CREDIT_NOTE_ITEM, {
      onCompleted: ({ creditNoteItem: { response, success } }) => {},
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
    onSelect: (
      record: any,
      selected: any,
      selectedRows: any,
      nativeEvent: any
    ) => {
      if (selected) {
        onAddClaims({
          variables: {
            invoiceItemId: record.id,
            creditNoteId: props.creditNoteId,
          },
        })
      }
    },
  }

  const onHandleOk = ({ target }: any) => {
    refetch({ filter: target.value })
  }

  return (
    <Modal
      title='Pending Transactions'
      open
      okText={false}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
      width='80%'
      footer={
        <Button onClick={() => props.hide(transactions)} danger type='primary'>
          Close
        </Button>
      }
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
            dataSource={data?.transactions ?? []}
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
