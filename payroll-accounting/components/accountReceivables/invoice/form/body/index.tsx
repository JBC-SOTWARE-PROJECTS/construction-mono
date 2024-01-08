import {
  ADD_INVOICE_ITEMS,
  REMOVE_INVOICE_ITEM,
} from '@/graphql/accountReceivables/invoices'
import { ArInvoiceItems } from '@/graphql/gql/graphql'
import { MoreOutlined, SearchOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import type { InputRef, MenuProps } from 'antd'
import { Button, Dropdown, Input, Space, Table, message } from 'antd'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import numeral from 'numeral'
import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { Action, StateI } from '..'
import { DataType } from '../types'
import BodyControls from './controls'
import { EditableCell, EditableRow, getFieldArrayValue } from './helper'
import { sortArrayText } from '@/hooks/accountReceivables/commons'
import { ColumnType } from 'antd/es/table'
import { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'

type EditableTableProps = Parameters<typeof Table>[0]

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

type DataIndex = keyof ArInvoiceItems

export interface extendARItems extends ArInvoiceItems {
  [key: string]: any // Adjust this to the appropriate type if possible
}

interface FormBodyI {
  id?: string
  seeMoreDialog: any
  tableLoader: boolean
  invoiceType: string
  editable: boolean
  state: StateI
  dispatch: (value: Action) => void
}
export default function FormBody(props: FormBodyI) {
  const { id, tableLoader, invoiceType, editable, state, dispatch } = props

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const [onUpdateItem, { loading: loadingInsert }] =
    useMutation(ADD_INVOICE_ITEMS)

  const [onRemoveInvoiceItem, { loading: removeInvoiceItemLoading }] =
    useMutation(REMOVE_INVOICE_ITEM, {
      onCompleted: ({ invoiceItem: { response, success } }) => {
        if (!success) {
          dispatch({ type: 'add-item', payload: response })
          message.error(
            'An error occurred while deleting the item. Please try again later.'
          )
        } else {
          message.success('Successfully deleted from the invoice.')
        }
      },
    })

  const handleDelete = (id: React.Key) => {
    const { dataSource } = state
    const newData = dataSource.filter((item) => item.id !== id)
    dispatch({ type: 'new-set-item', payload: newData })
    onRemoveInvoiceItem({ variables: { id } })
  }

  const onHandleClickRowMenu = (key: string, id: string) => {
    switch (key) {
      case 'remove':
        return handleDelete(id)
      default:
        return null
    }
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<ArInvoiceItems> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] as number}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{ color: filtered ? '#1677ff' : 'black', fontSize: 15 }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : text ? (
        text
      ) : dataIndex == 'itemName' ? (
        'Click to Select'
      ) : (
        ''
      ),
  })

  const actionItems: MenuProps['items'] = [
    {
      label: 'Remove',
      key: 'remove',
    },
  ]

  const defaultColumns: any[] = [
    {
      title: 'Transaction Date',
      dataIndex: 'transactionDate',
      className: 'DATE',
      width: 180,
      editable: true,
      ...getColumnSearchProps('transactionDate'),
      sorter: (a: any, b: any) => {
        if (a.transactionDate && b.transactionDate) {
          const dateA = dayjs(a.transactionDate).unix()
          const dateB = dayjs(b.transactionDate).unix()
          return dateA - dateB
        }
        return 0
      },
      render: (text: any) => (text ? dayjs(text).format(' YYYY-MM-DD') : null),
    },
    {
      title: 'Product/Services',
      dataIndex: ['invoiceParticulars', 'itemName'],
      className: 'SEARCH',
      width: 300,
      editable: true,
      sorter: (a: any, b: any) =>
        sortArrayText(a.itemName as string, b.itemName as string),
      defaultSortOrder: ['ascend'],
      ...getColumnSearchProps(['invoiceParticulars', 'itemName'] as any),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      editable: true,
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      className: 'NUMBER',
      align: 'right',
      width: 100,
      editable: true,
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: 'Rate/Price',
      dataIndex: 'unitPrice',
      align: 'right',
      className: 'NUMBER',
      width: 150,
      editable: true,
      sorter: (a: any, b: any) => a.unitPrice - b.unitPrice,
      render: (text: number) => new Decimal(text ?? 0).toString(),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmountDue',
      align: 'right',
      fixed: 'right',
      className: 'NUMBER',
      width: 180,
      editable:
        invoiceType == 'PROJECT' || state.isCWT || state.isVatable
          ? false
          : true,
      sorter: (a: any, b: any) => a.totalAmountDue - b.totalAmountDue,
      render: (text: number) => numeral(text).format('0,0.00'),
    },
    {
      title: ' ',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 50,
      render: (id: string, record: any, index: number) => {
        return (
          // isEditable && (
          <Dropdown
            menu={{
              items: actionItems,
              onClick: ({ key }) => onHandleClickRowMenu(key, id),
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
        // )
      },
    },
  ]

  const handleSave = (row: ArInvoiceItems, fields: any, dataIndex: string) => {
    const { dataSource } = state
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]

    const actualValue = getFieldArrayValue(dataIndex, fields)
    if (invoiceType == 'REGULAR') {
      let totalAmountDue = 0
      switch (dataIndex) {
        case 'quantity':
          let fieldValueQty = new Decimal(actualValue)
          totalAmountDue = parseFloat(
            new Decimal(item?.unitPrice ?? 0).times(fieldValueQty).toString()
          )
          fields.totalAmountDue = totalAmountDue
          row.totalAmountDue = totalAmountDue

          break
        case 'unitPrice':
          let fieldValuePrice = new Decimal(actualValue)
          totalAmountDue = parseFloat(
            new Decimal(item?.quantity ?? 0).times(fieldValuePrice).toString()
          )
          fields.totalAmountDue = totalAmountDue
          row.totalAmountDue = totalAmountDue
          break
        case 'totalAmountDue':
          let fieldValueTotal = new Decimal(actualValue)
          const quantity = new Decimal(item?.quantity ?? 0)
          const unitPrice = fieldValueTotal.dividedBy(quantity)
          fields.unitPrice = unitPrice
          row.unitPrice = unitPrice
        default:
          break
      }
    }

    const isArray = Array.isArray(dataIndex)
    if (isArray) {
      let latestCol: extendARItems = { ...fields }
      let buildCol: any = {}

      if (dataIndex)
        dataIndex.map((da, index) => {
          const length = dataIndex.length
          if (index === length - 1) {
            dataIndex.reverse().map((ra, reverseIndex) => {
              const last = {
                id: latestCol[da].value,
                [da]: latestCol[da].label,
              }
              if (reverseIndex > 0) {
                if (reverseIndex == 1) {
                  buildCol[ra] = last
                } else buildCol[ra] = buildCol
              }
            })
          }
          latestCol = latestCol[da]
        })
      fields = buildCol
      row = { ...row, ...buildCol }
    }

    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    dispatch({ type: 'new-set-item', payload: newData })

    onUpdateItem({
      variables: {
        id: row?.id,
        fields,
      },
      onCompleted: ({
        addInvoiceItem,
      }: {
        addInvoiceItem: {
          success: boolean
          response: ArInvoiceItems
          message: string
        }
      }) => {
        const { success, response, message: messageText } = addInvoiceItem
        if (!success) {
          const oldData = [...dataSource]
          const index = oldData.findIndex((item) => row.id === item.id)
          const item = oldData[index]

          if (response) {
            oldData.splice(index, 1, {
              ...item,
              ...response,
            })
          }

          dispatch({
            type: 'new-set-item',
            payload: oldData,
          })
          message.error(messageText)
        } else {
          const isArray = Array.isArray(dataIndex)
          if (isArray) {
            if (dataIndex.includes('itemName')) {
              fields = {}
              row.unitPrice = response.invoiceParticulars?.salePrice
              row.description = response.invoiceParticulars?.description
              const totalAmountDue = parseFloat(
                new Decimal(row.unitPrice ?? 0)
                  .times(new Decimal(row?.quantity ?? 0))
                  .toString()
              )

              fields.unitPrice = row.unitPrice
              fields.description = row.description
              row.totalAmountDue = totalAmountDue

              newData.splice(index, 1, {
                ...item,
                ...row,
              })
              dispatch({ type: 'new-set-item', payload: newData })
              onUpdateItem({
                variables: {
                  id: row?.id,
                  fields,
                },
              })
            }
          }
        }
      },
    })
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        fieldType: col.className,
        handleSave,
      }),
    }
  })

  return (
    <Space
      direction='vertical'
      style={{ width: '100%', marginTop: 35 }}
      size='middle'
    >
      <BodyControls
        {...{ invoiceType, editable, state, dispatch, onUpdateItem }}
      />
      <EditableTableCSS>
        <Table
          rowKey='id'
          components={components}
          rowClassName={() => 'editable-row'}
          columns={columns as ColumnTypes}
          size='middle'
          bordered
          dataSource={state.dataSource}
          pagination={false}
          scroll={{ x: 1200 }}
          loading={tableLoader}
        />
      </EditableTableCSS>
    </Space>
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
    padding: 6px 0px;
    min-height: 35px;
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
