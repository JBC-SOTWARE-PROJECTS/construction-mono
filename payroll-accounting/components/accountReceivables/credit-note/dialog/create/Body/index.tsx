import { CreditNCreateContextProps } from '../CreditNCreate'
import CnBodyTable from './BodyTable'
import {
  EditableCell,
  EditableCellProps,
  EditableRow,
  EditableRowProps,
  getCnColumnSearchProps,
} from '../components'
import { ArCreditNoteItems } from '@/graphql/gql/graphql'
import Decimal from 'decimal.js'
import { Button, Dropdown, InputRef } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import numeral from 'numeral'
import { sortArrayText } from '@/hooks/accountReceivables/commons'
import { useState, useRef } from 'react'
import { CnTableActionItems } from '../props'
import { onHandleCnSave } from '../functions'
import { useDialog } from '@/hooks'
import InvoiceOutstandingRecordsForCreditNote from '../../invoiceOutstandingRecordsForCreditNote'

interface CnComponentsI {
  body: {
    row: React.FC<EditableRowProps>
    cell: React.FC<EditableCellProps>
  }
}
export interface CnTablePropsI {
  components: CnComponentsI
  columns: any[]
}

export default function CNBodyContainer(props: CreditNCreateContextProps) {
  const { state, dispatch, mutation, loading, lazyQuery, refetch } = props
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const claimsDialog = useDialog(InvoiceOutstandingRecordsForCreditNote)

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const handleDelete = (id: React.Key) => {
    const { dataSource } = state
    const newData = dataSource.filter((item) => item.id !== id)
    dispatch({ type: 'new-set-item', payload: newData })
    mutation?.removeCreditNoteItem({ variables: { id } })
  }

  const onHandleClickRowMenu = (key: string, id: string) => {
    switch (key) {
      case 'remove':
        return handleDelete(id)
      default:
        return null
    }
  }

  const getColumnSearchProps = (dataIndex: string) =>
    getCnColumnSearchProps(
      dataIndex,
      searchInput,
      searchedColumn,
      searchText,
      setSearchText,
      setSearchedColumn
    )

  const defaultColumns: any[] = [
    {
      title: 'Product/Services',
      dataIndex: ['invoiceParticulars', 'itemName'],
      className: 'SEARCH',
      width: 300,
      editable: state?.invoiceType == 'CLAIMS' ? false : true,
      sorter: (a: any, b: any) =>
        sortArrayText(a.itemName as string, b.itemName as string),
      defaultSortOrder: ['ascend'],
      ...getColumnSearchProps(
        state?.invoiceType == 'CLAIMS'
          ? (['itemName'] as any)
          : (['invoiceParticulars', 'itemName'] as any)
      ),
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
        state?.invoiceType == 'CLAIMS' || state.isCWT || state.isVatable
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
          <Dropdown
            menu={{
              items: CnTableActionItems,
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

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: ArCreditNoteItems) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        fieldType: col.className,
        handleSave: onHandleCnSave,
        lazyQuery,
        state,
        mutation,
        dispatch,
      }),
    }
  })

  const tableProps: CnTablePropsI = {
    components,
    columns,
  }
  return (
    <CnBodyTable
      {...{
        tableProps,
        state,
        loading,
        claimsDialog,
        dispatch,
        mutation,
        refetch,
      }}
    />
  )
}
