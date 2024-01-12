import React, { useContext, useEffect, useRef, useState } from 'react'
import type { InputRef } from 'antd'
import { Button, Col, Form, Input, Popconfirm, Row, Space, Table } from 'antd'
import type { FormInstance } from 'antd/es/form'
import numeral from 'numeral'
import styled from 'styled-components'
import TableCell from './table-components'
import dayjs from 'dayjs'
import { DeleteOutlined } from '@ant-design/icons'
import { FixedAssetItems, Office } from '@/graphql/gql/graphql'
import { DepreciationMethodsObj } from '@/constant/fixed-asset'
import { v4 as uuidv4 } from 'uuid'

export const FAEditableContext = React.createContext<FormInstance<any> | null>(
  null
)

interface FormFields {
  itemName: { value: string; label: string } | null
  office: { value: string; label: string } | null
}
interface EditableRowProps {
  index: number
}

const StyledTD = styled.td<{ $active?: boolean }>`
  border: ${(props) => (props.$active ? '1px solid teal!important' : 'none')};
`

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <FAEditableContext.Provider value={form}>
        <tr {...props} />
      </FAEditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof FixedAssetItems
  record: FixedAssetItems
  handleSave: (record: FixedAssetItems) => void
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
  const form: FormInstance<FormFields> = useContext(FAEditableContext)!

  // useEffect(() => {
  //   if (editing) {
  //     inputRef.current!.focus()
  //   }
  // }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    switch (dataIndex) {
      case 'itemName':
        form.setFieldsValue({
          itemName: {
            label: record?.itemName as string,
            value: record?.itemId as string,
          },
        })
        break
      case 'office':
        form.setFieldsValue({
          office: {
            label: record?.office?.officeDescription as string,
            value: record?.office?.id as string,
          },
        })
        break
      default:
        form.setFieldsValue({ [dataIndex]: record[dataIndex] })
        break
    }
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      let newRecord = { ...record }
      switch (dataIndex) {
        case 'itemName':
          var FormField = values[dataIndex]
          newRecord = {
            ...newRecord,
            itemId: FormField?.value,
            itemName: FormField?.label,
          }
          break
        case 'office':
          var FormField = values[dataIndex]
          newRecord = {
            ...newRecord,
            office: {
              id: FormField?.value,
              officeDescription: FormField?.label,
            },
          }
          break
        default:
          newRecord = { ...newRecord, ...(values as FixedAssetItems) }
          break
      }

      toggleEdit()
      handleSave({ ...newRecord })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <TableCell {...{ dataIndex, inputRef, record, save }} />
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

  return (
    <StyledTD {...restProps} $active={editing}>
      {childNode}
    </StyledTD>
  )
}

type EditableTableProps = Parameters<typeof Table>[0]

interface DataType {
  key: React.Key
  name: string
  age: string
  address: string
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface MultiFixedAssetItemTableI {
  isBegBal: boolean
  dataSource: FixedAssetItems[]
  setDataSource: React.Dispatch<React.SetStateAction<FixedAssetItems[]>>
}

export default function MultiFixedAssetItemTable(
  props: MultiFixedAssetItemTableI
) {
  const { isBegBal, dataSource, setDataSource } = props

  const [count, setCount] = useState(2)

  const handleDelete = (id: string) => {
    const newData = dataSource.filter((item) => item.id !== id)
    setDataSource(newData)
  }

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: '#',
      dataIndex: 'id',
      width: 20,
      render: (_, __, index: number) => index + 1,
    },
    {
      title: 'Serial No.',
      dataIndex: 'serialNo',
      width: 140,
      editable: true,
    },
    {
      title: 'Asset Name',
      dataIndex: 'itemName',
      width: 180,
      editable: true,
    },
    {
      title: 'Office',
      dataIndex: 'office',
      width: 150,
      editable: true,
      render: (text: Office) => text?.officeDescription ?? '',
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      width: 120,
      editable: true,
      render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : ''),
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchasePrice',
      align: 'right',
      width: 120,
      editable: true,
      render: (text) => (text ? numeral(text).format('0,0.00') : ''),
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      align: 'right',
      width: 100,
      editable: true,
    },
    {
      title: 'Depreciation Method',
      dataIndex: 'depreciationMethod',
      width: 140,
      editable: true,
      render: (text: keyof typeof DepreciationMethodsObj) =>
        text ? DepreciationMethodsObj[text] : '',
    },
    {
      title: 'Depreciation Start Date',
      dataIndex: 'depreciationStartDate',
      width: 150,
      editable: true,
      render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : ''),
    },
    {
      title: 'Accumulated Depreciation',
      dataIndex: 'accumulatedDepreciation',
      width: 150,
      editable: true,
      render: (text) => (text ? numeral(text).format('0,0.00') : ''),
    },
    {
      title: 'Salvage Value',
      dataIndex: 'salvageValue',
      align: 'right',
      width: 120,
      editable: true,
      render: (text) => (text ? numeral(text).format('0,0.00') : ''),
    },

    {
      title: 'Useful Life',
      dataIndex: 'usefulLife',
      align: 'right',
      width: 120,
      editable: true,
      render: (text) => (text ? `${text} year(s)` : ''),
    },
    {
      title: '#',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 50,
      render: (value: string) =>
        dataSource.length >= 1 ? (
          <Button
            type='link'
            onClick={() => handleDelete(value)}
            icon={<DeleteOutlined />}
          />
        ) : null,
    },
  ]

  const handleAdd = () => {
    const newData: FixedAssetItems = {
      id: uuidv4(),
      purchaseDate: dayjs(),
      depreciationStartDate: dayjs(),
      isBeginningBalance: isBegBal,
    }
    setDataSource([...dataSource, newData])
    setCount(count + 1)
  }

  const handleAddFromReceiving = () => {}

  const handleSave = (row: FixedAssetItems) => {
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
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <Row gutter={[8, 8]}>
      <Col flex='100%'>
        <StyledWrapper>
          <Table
            title={() => (
              <Space>
                {isBegBal ? (
                  <Button onClick={handleAdd} type='primary'>
                    Add a row
                  </Button>
                ) : (
                  <Button onClick={handleAddFromReceiving} type='primary'>
                    Add a asset
                  </Button>
                )}
              </Space>
            )}
            size='small'
            bordered
            components={components}
            columns={columns as ColumnTypes}
            rowClassName={() => 'editable-row'}
            dataSource={dataSource}
            scroll={{ x: 2100 }}
          />
        </StyledWrapper>
      </Col>
    </Row>
  )
}

const StyledWrapper = styled.div`
  .ant-table-cell {
    height: 50px !important;
  }

  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
    min-height: 28px;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }
`
