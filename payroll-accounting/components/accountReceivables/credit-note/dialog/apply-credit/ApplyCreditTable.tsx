import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { InputRef } from 'antd'
import { Button, Form, Input, InputNumber, Popconfirm, Table } from 'antd'
import type { FormInstance } from 'antd/es/form'
import styled from 'styled-components'
import { CnAllocateCreditDataType } from '.'
import dayjs from 'dayjs'
import numeral from 'numeral'

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface Item {
  key: string
  name: string
  age: string
  address: string
}

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof Item
  record: Item
  handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Required.`,
          },
        ]}
      >
        <InputNumber
          autoFocus
          onPressEnter={save}
          onBlur={save}
          style={{ width: '100%' }}
        />
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

type EditableTableProps = Parameters<typeof Table>[0]

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface AllocateCreditTableI {
  dataSource: CnAllocateCreditDataType[]
  setDataSource: Dispatch<SetStateAction<CnAllocateCreditDataType[]>>
}
const AllocateCreditTable = (props: AllocateCreditTableI) => {
  const { dataSource, setDataSource } = props

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.id !== key)
    setDataSource(newData)
  }

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
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
    {
      title: 'Amount to Allocate',
      dataIndex: 'allocatedAmount',
      width: 150,
      editable: true,
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: '#',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title='Sure to delete?'
            onConfirm={() => handleDelete(record.id)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ]

  const handleSave = (row: CnAllocateCreditDataType) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
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
      onCell: (record: CnAllocateCreditDataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <AllocateTableCss>
      <Table
        rowKey='id'
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        size='small'
        pagination={false}
      />
    </AllocateTableCss>
  )
}

export default AllocateCreditTable

const AllocateTableCss = styled.div`
  th.ant-table-cell {
    border-radius: 0px !important;
    background: #fff !important;
    color: #000a1ebf !important;
    font-weight: bolder !important;
  }

  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }
`
