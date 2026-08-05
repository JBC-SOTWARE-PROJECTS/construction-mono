import { FormInput, FormSelect } from "@/components/common"
import PageFilterContainer from "@/components/common/custom-components/page-filter-container"
import { InvoiceTypeOption } from "@/constant/accountReceivables"
import { ArInvoiceWithOutstandingBal, PaymentItem } from "@/graphql/gql/graphql"
import { gql, useQuery } from "@apollo/client"
import { Form, Modal, Space, Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useForm } from "antd/lib/form/Form"
import dayjs from "dayjs"
import numeral from "numeral"
import React, { useState } from "react"
import styled from "styled-components"

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
      amountToApply: balance
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

const columns: ColumnsType<ArInvoiceWithOutstandingBal> = [
  {
    title: "INVOICE #",
    dataIndex: "invoiceNo",
    width: 150,
  },
  {
    title: "RECORD #",
    dataIndex: "docNo",
    width: 100,
  },
  {
    title: "PARTICULAR",
    dataIndex: "particular",
  },
  {
    title: "TYPE",
    dataIndex: "itemType",
  },
  {
    title: "REFERENCE",
    dataIndex: "reference",
  },
  {
    title: "DUE DATE",
    dataIndex: "dueDate",
    width: 150,
    render: (text) => dayjs(text).format("YYYY/MM/DD"),
  },

  {
    title: "AMOUNT",
    dataIndex: "amount",
    width: 150,
    align: "right",
    render: (text) => numeral(text).format("0,0.00"),
  },

  {
    title: "BALANCE",
    dataIndex: "balance",
    width: 150,
    align: "right",
    render: (text) => numeral(text).format("0,0.00"),
  },
]

interface InvoiceItemsOutstandingRecordsI {
  hide: (values: any) => void
  customerId: string
  transactions: ClientTransactionI[]
  invoiceType: string
  selected: string[]
  haBalance: boolean
}

interface RowObj {
  [key: string]: ArInvoiceWithOutstandingBal
}

export default function InvoiceItemsOutstandingRecords(
  props: InvoiceItemsOutstandingRecordsI
) {
  const [form] = useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>(
    props.selected ?? []
  )
  const [transactions, setTransactions] = useState<RowObj | null>(null)

  const { data, loading, refetch } = useQuery(PENDING_TRANSACTIONS, {
    variables: {
      customerId: props.customerId,
      filter: "",
      filterType: "",
      invoiceType: "CLAIMS",
      haBalance: props.haBalance ?? true,
    },
  })

  const onSelectChange = (newSelectedRowKeys: any[], selectedRows: any) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const onSelect = (record?: ArInvoiceWithOutstandingBal | null) => {
    const currentSel: string[] = [...(selectedRowKeys ?? []), record?.id ?? ""]
    const existing = { ...transactions }
    if (record) {
      existing[record?.id as string] = record
      setTransactions(existing)
    }
    setSelectedRowKeys(currentSel)
  }

  const onSelectAll = (
    selected: boolean,
    _: ArInvoiceWithOutstandingBal[],
    changeRows: ArInvoiceWithOutstandingBal[]
  ) => {
    const newItems = { ...transactions }

    if (selected) {
      changeRows.map((selRow) => {
        newItems[selRow?.id ?? ""] = selRow
      })
    } else {
      changeRows.map((selRow) => {
        delete newItems[selRow?.id ?? ""]
      })
    }

    setTransactions({ ...newItems })
  }

  const rowSelection = {
    onSelectAll,
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect,
  }

  const onHandleOk = ({ target }: any) => {
    refetch({ filter: target.value })
  }

  const onOk = () => {
    const selectedItems: PaymentItem[] = []
    selectedRowKeys.map((key) => {
      if (transactions) {
        const record = transactions[key as string]
        const newRecord: PaymentItem = {
          id: record?.id,
          itemName: `[${record?.invoiceNo ?? "-"}] [${record?.docNo ?? "-"}] ${
            record?.particular ?? ""
          }`,
          description: `${record?.itemType ?? ""} ${record?.reference ?? ""}`,
          qty: 1,
          price: record?.balance ?? 0,
          amount: record?.balance ?? 0,
        }
        selectedItems.push(newRecord)
      }
    })

    props.hide(selectedItems)
  }

  const onSelectInvoiceType = (invoiceType: string) => {
    refetch({ invoiceType })
  }

  return (
    <Modal
      title="Pending Transactions"
      open
      okText="Add"
      onOk={onOk}
      okButtonProps={{ size: "large" }}
      cancelButtonProps={{ size: "large" }}
      onCancel={() => props.hide(props.transactions ?? [])}
      width="80%"
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ invoiceType: "CLAIMS" }}
        >
          <PageFilterContainer
            leftSpace={
              <FormInput
                name="filter"
                label="Find Invoice No."
                propsinput={{ size: "large", onPressEnter: onHandleOk }}
              />
            }
            rightSpace={
              <FormSelect
                name="invoiceType"
                label="Type"
                propsselect={{
                  options: InvoiceTypeOption,
                  onSelect: onSelectInvoiceType,
                  style: {
                    width: 100,
                  },
                }}
              />
            }
          />
        </Form>
        <EditableTableCSS>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            loading={loading}
            dataSource={data?.transactions ?? []}
            onRow={(record: any, rowIndex) => {
              return {
                onClick: (event) => {
                  onSelect(record)
                }, // click row
              }
            }}
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
