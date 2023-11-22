import { MoreOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Row, Table } from 'antd'
import dayjs from 'dayjs'
import numeral from 'numeral'
import React, { useContext } from 'react'
import { ReceivePayCreateContext } from '..'
import { EditableCell, EditableRow } from '../functions/body'
import { EditableTableCSS } from '../props'
import { ClientTransactionI, ColumnTypes } from '../types'

export default function PendingTransactions() {
  const { state, dispatch } = useContext(ReceivePayCreateContext)

  const handleDelete = (key: React.Key) => {
    const newData = state.transactions.filter((item) => item.id !== key)
    dispatch({ type: 'set-transactions', payload: newData })
  }

  const onHandleClickRowMenu = (key: string, id: string) => {
    switch (key) {
      case 'remove':
        return handleDelete(id)
      default:
        return null
    }
  }

  const defaultColumns: (ColumnTypes[any] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'RECORD #',
      dataIndex: 'docNo',
      width: 150,
    },
    {
      title: 'INVOICE #',
      dataIndex: 'invoiceNo',
      width: 150,
    },
    {
      title: 'PARTICULAR',
      dataIndex: 'particular',
      render: (text) => <a>{text}</a>,
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
    {
      title: 'PAYMENT',
      dataIndex: 'amountToApply',
      align: 'right',
      editable: true,
      fixed: 'right',
      width: 250,
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: '#',
      dataIndex: 'id',
      fixed: 'right',
      align: 'center',
      width: 60,
      render: (text) => {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  label: 'Remove',
                  key: 'remove',
                },
              ],
              onClick: ({ key }) => onHandleClickRowMenu(key, text),
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

  const handleSave = (row: ClientTransactionI) => {
    const newData = [...state.transactions]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    dispatch({ type: 'set-transactions', payload: newData })
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
      onCell: (record: ClientTransactionI) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <Row>
      <Col flex='auto'>
        <EditableTableCSS>
          <Table
            size='small'
            rowKey='id'
            components={components}
            rowClassName={() => 'editable-row'}
            columns={columns as any}
            dataSource={state?.transactions ?? []}
            scroll={{ x: 1000 }}
          />
        </EditableTableCSS>
      </Col>
    </Row>
  )
}
