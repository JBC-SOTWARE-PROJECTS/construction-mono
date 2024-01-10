import { SetStateType } from '@/components/common/types/common-types'
import { ProjectWorkAccomplishItems } from '@/graphql/gql/graphql'
import {
  Form,
  FormInstance,
  Input,
  InputNumber,
  InputRef,
  Table,
  Typography,
} from 'antd'
import Decimal from 'decimal.js'
import numeral from 'numeral'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

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
  required: boolean
  record: Item
  handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  required,
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
            required: !!required,
            message: '',
          },
        ]}
      >
        <InputNumber autoFocus onPressEnter={save} onBlur={save} />
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

interface TableSummaryCellI {
  text: string
  index: number
  align?: any
}
const TableSummaryCell = ({ text, index, align }: TableSummaryCellI) => {
  return (
    <Table.Summary.Cell index={index} align={align ?? 'right'}>
      <Typography.Text type='success'>{text}</Typography.Text>
    </Table.Summary.Cell>
  )
}

interface UpsertWorkAccomplishmentsTable {
  dataSource: ProjectWorkAccomplishItems[]
  setDataSource: SetStateType<ProjectWorkAccomplishItems[]>
}

export default function UpsertWorkAccomplishmentsTable(
  props: UpsertWorkAccomplishmentsTable
) {
  const { dataSource, setDataSource } = props

  const defaultColumns: (any & {
    editable?: boolean
    dataIndex: string
    required?: boolean
  })[] = [
    {
      title: 'Item No',
      dataIndex: 'itemNo',
      align: 'center',
      width: 40,
      fixed: 'left',
    },
    {
      title: 'Item Description',
      dataIndex: 'description',
      align: 'center',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      align: 'center',
      width: 30,
    },
    {
      title: 'ORIGINAL CONTRACT',
      children: [
        {
          title: 'Quantity',
          dataIndex: 'qty',
          align: 'right',
          width: 50,
        },
        {
          title: 'Unit Cost',
          dataIndex: 'cost',
          align: 'right',
          width: 50,
          render: (text: string) => numeral(text).format('0,0.00'),
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          align: 'right',
          width: 50,
          render: (_: string, record: ProjectWorkAccomplishItems) => {
            const result = new Decimal(record?.qty ?? 0).times(
              new Decimal(record?.cost)
            )

            return numeral(result.toString()).format('0,0.00')
          },
        },
      ],
    },
    {
      title: 'RELATIVE WEIGHT',
      dataIndex: 'relativeWeight',
      align: 'center',
      width: 40,
      render: (text: string) => (text ? `${text}%` : '0%'),
    },
    {
      title: 'QUANTITY ACCOMPLISHMENT',
      children: [
        {
          title: 'Previous',
          dataIndex: 'prevQty',
          align: 'right',
          width: 50,
          editable: true,
          render: (text: string) => text ?? '-',
        },
        {
          title: 'This Period',
          dataIndex: 'thisPeriodQty',
          align: 'right',
          width: 50,
          editable: true,
          render: (text: string) => text ?? '-',
        },
        {
          title: 'To Date',
          dataIndex: 'toDateQty',
          align: 'right',
          width: 50,
          editable: true,
          render: (text: string) => text ?? '-',
        },
        {
          title: 'Balance',
          dataIndex: 'balanceQty',
          align: 'right',
          width: 50,
          render: (text: string) => text ?? '-',
        },
      ],
    },
    {
      title: 'AMOUNT ACCOMPLISHMENT',
      children: [
        {
          title: 'Previous',
          dataIndex: 'prevAmount',
          align: 'right',
          width: 50,
          render: (text: string) =>
            text ? numeral(text).format('0,0.00') : '-',
        },
        {
          title: 'This Period',
          dataIndex: 'thisPeriodAmount',
          align: 'right',
          width: 50,
          render: (text: string) =>
            text ? numeral(text).format('0,0.00') : '-',
        },
        {
          title: 'To Date',
          dataIndex: 'toDateAmount',
          align: 'right',
          width: 50,
          render: (text: string) =>
            text ? numeral(text).format('0,0.00') : '-',
        },
        {
          title: 'Balance',
          dataIndex: 'balanceAmount',
          align: 'right',
          width: 50,
          render: (text: string) =>
            text ? numeral(text).format('0,0.00') : '-',
        },
      ],
    },
    {
      title: 'PERCENTAGE',
      dataIndex: 'percentage',
      align: 'center',
      width: 50,
      render: (text: string) =>
        text ? `${numeral(text).format('0.00')}%` : '-',
    },
  ]

  const calculateBalance = (row: ProjectWorkAccomplishItems) => {
    const prev = new Decimal(row?.qty ?? 0).minus(
      new Decimal(row?.prevQty ?? 0)
    )

    const balance = prev.minus(row?.thisPeriodQty ?? 0).toString()

    row.balanceQty = parseInt(balance)
    return row
  }

  const calculatePercentage = (row: ProjectWorkAccomplishItems) => {
    const totalAmount = new Decimal(row?.qty ?? 0).times(
      new Decimal(row?.cost ?? 0)
    )

    const prevPlusThisPeriod = new Decimal(row?.prevAmount).plus(
      new Decimal(row?.thisPeriodAmount ?? 0)
    )
    const amountDividedByTotalAmount = prevPlusThisPeriod.dividedBy(totalAmount)

    const percentage = amountDividedByTotalAmount
      .times(new Decimal(row.relativeWeight ?? 0))
      .toString()

    row.percentage = parseFloat(percentage)
    return row
  }

  const calculateAmountAccomplish = (row: ProjectWorkAccomplishItems) => {
    const cost = new Decimal(row?.cost ?? 0)

    const prev = cost.times(new Decimal(row.prevQty ?? 0)).toString()
    const thisPeriod = cost
      .times(new Decimal(row.thisPeriodQty ?? 0))
      .toString()
    const toDate = cost.times(new Decimal(row.toDateQty ?? 0)).toString()
    const balance = cost.times(new Decimal(row.balanceQty ?? 0)).toString()

    row.prevAmount = parseFloat(prev)
    row.thisPeriodAmount = parseFloat(thisPeriod)
    row.toDateAmount = parseFloat(toDate)
    row.balanceAmount = parseFloat(balance)
    return row
  }

  const handleSave = (row: ProjectWorkAccomplishItems) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]

    row = calculateBalance(row)
    row = calculateAmountAccomplish(row)
    row = calculatePercentage(row)

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
    if (col?.children) {
      const newColumns = col?.children.map((childData: any) => {
        if (!childData.editable) {
          return childData
        }
        return {
          ...childData,
          onCell: (record: ProjectWorkAccomplishItems) => ({
            record,
            required: childData.required,
            editable: childData.editable,
            dataIndex: childData.dataIndex,
            title: childData.title,
            handleSave,
          }),
        }
      })
      return { ...col, children: newColumns }
    }

    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: ProjectWorkAccomplishItems) => ({
        record,
        required: col.required,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <TableCSV>
      <Table
        components={components}
        columns={columns}
        rowClassName={() => 'editable-row'}
        dataSource={dataSource ?? []}
        bordered
        size='small'
        scroll={{ x: 'calc(1600px + 50%)' }}
        summary={(pageData) => {
          let totalAmount = 0
          let totalRelativeWeight = 0
          let totalPrevAmount = 0
          let totalToDateAmount = 0
          let totalThisPeriodAmount = 0
          let totalBalanceAmount = 0
          let totalPercentage = 0

          pageData.forEach(
            ({
              cost,
              qty,
              relativeWeight,
              prevAmount,
              thisPeriodAmount,
              toDateAmount,
              balanceAmount,
              percentage,
            }) => {
              const amount = new Decimal(cost).times(new Decimal(qty ?? 0))

              const currentTotalAmount = new Decimal(totalAmount ?? 0)
                .plus(amount)
                .toString()

              const currentRelativeWeight = new Decimal(relativeWeight ?? 0)
                .plus(new Decimal(totalRelativeWeight))
                .toString()

              const currentTotalPrevAmount = new Decimal(prevAmount ?? 0)
                .plus(new Decimal(totalPrevAmount))
                .toString()

              const currentTotalToDateAmount = new Decimal(toDateAmount ?? 0)
                .plus(new Decimal(totalToDateAmount))
                .toString()

              const currentTotalThisPeriodAmount = new Decimal(
                thisPeriodAmount ?? 0
              )
                .plus(new Decimal(totalThisPeriodAmount))
                .toString()

              const currentTotalBalanceAmount = new Decimal(balanceAmount ?? 0)
                .plus(new Decimal(totalBalanceAmount))
                .toString()

              const currentTotalPercentage = new Decimal(percentage ?? 0)
                .plus(new Decimal(totalPercentage))
                .toString()

              totalAmount = parseFloat(currentTotalAmount)
              totalRelativeWeight = parseFloat(currentRelativeWeight)

              totalPrevAmount = parseFloat(currentTotalPrevAmount)
              totalToDateAmount = parseFloat(currentTotalToDateAmount)
              totalThisPeriodAmount = parseFloat(currentTotalThisPeriodAmount)
              totalBalanceAmount = parseFloat(currentTotalBalanceAmount)
              totalPercentage = parseFloat(currentTotalPercentage)
            }
          )

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={3} />
                <TableSummaryCell
                  text={numeral(totalAmount).format('0,0.00')}
                  index={5}
                />
                <TableSummaryCell
                  text={`${numeral(totalRelativeWeight).format('0,0.00')}%`}
                  index={6}
                  align={'center'}
                />
                <Table.Summary.Cell index={7} colSpan={4} />
                <TableSummaryCell
                  text={numeral(totalPrevAmount).format('0,0.00')}
                  index={8}
                />
                <TableSummaryCell
                  text={numeral(totalToDateAmount).format('0,0.00')}
                  index={9}
                />
                <TableSummaryCell
                  text={numeral(totalThisPeriodAmount).format('0,0.00')}
                  index={10}
                />
                <TableSummaryCell
                  text={numeral(totalBalanceAmount).format('0,0.00')}
                  index={11}
                />
                <TableSummaryCell
                  text={`${numeral(totalPercentage).format('0,0.00')}%`}
                  index={12}
                  align={'center'}
                />
              </Table.Summary.Row>
            </>
          )
        }}
      />
    </TableCSV>
  )
}

const TableCSV = styled.div`
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
