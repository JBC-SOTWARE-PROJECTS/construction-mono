import { CustomModalPageHeader } from '@/components/accountReceivables/common'
import ChartOfAccountsComponentSelector from '@/components/chartOfAccounts/chartOfAccountsSelector'
import { useDialog } from '@/hooks'
import { randomId } from '@/utility/helper'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, InputNumber, Modal, Table } from 'antd'
import type { FormInstance } from 'antd/es/form'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface Item {
  id: string
  code: string
  accountName: string
  amount: number
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
            message: ``,
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

interface CommonJournalEntryI {
  hide: (entries: any[]) => void
  defaultAccounts: any[]
}

const CommonJournalEntry = (props: CommonJournalEntryI) => {
  const showAccountSelector = useDialog(ChartOfAccountsComponentSelector)

  const [dataSource, setDataSource] = useState<Item[]>(
    props?.defaultAccounts ?? []
  )

  const handleDelete = (code: string) => {
    const newData = dataSource.filter((item) => item.code !== code)
    setDataSource(newData)
  }

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Account Code',
      dataIndex: 'code',
    },
    {
      title: 'Account Name',
      dataIndex: 'accountName',
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      fixed: 'right',
      align: 'right',
      editable: true,
      width: '200px',
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      fixed: 'right',
      align: 'right',
      editable: true,
      width: '200px',
    },
    {
      title: '',
      fixed: 'right',
      align: 'center',
      dataIndex: 'code',
      width: '80px',
      render: (text: string) => (
        <Button
          onClick={() => handleDelete(text)}
          type='primary'
          icon={<DeleteOutlined />}
        />
      ),
    },
  ]

  const handleAdd = () => {
    showAccountSelector({}, (selected: Item[]) => {
      if (selected) {
        const newSelected = selected.map((select) => ({
          ...select,
          id: randomId(),
          amount: 0.0,
        }))
        setDataSource(newSelected)
      }
    })
  }

  const handleSave = (row: Item) => {
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
      onCell: (record: Item) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <Modal
      open
      width='100%'
      title={<CustomModalPageHeader label={'Journal Entry'} />}
      okText='Submit'
      onOk={() => props.hide(dataSource)}
      onCancel={() => props.hide([])}
    >
      <Button onClick={handleAdd} type='primary' style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <EditableTable>
        <Table
          rowKey='id'
          bordered={false}
          size='small'
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource}
          columns={columns as ColumnTypes}
        />
      </EditableTable>
    </Modal>
  )
}

export default CommonJournalEntry

const EditableTable = styled.div`
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
