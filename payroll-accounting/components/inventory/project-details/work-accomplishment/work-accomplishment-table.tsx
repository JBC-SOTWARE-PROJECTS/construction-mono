import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
  key: React.Key
  name: string
  age: number
  street: string
  building: string
  number: number
  companyAddress: string
  companyName: string
  gender: string
}

export default function WorkAccomplishmentsTable() {
  const columns: ColumnsType<DataType> = [
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
          align: 'center',
          width: 50,
        },
        {
          title: 'Unit Cost',
          dataIndex: 'unit',
          align: 'center',
          width: 50,
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          align: 'center',
          width: 50,
        },
      ],
    },
    {
      title: 'RELATIVE WEIGHT',
      dataIndex: 'relativeWeight',
      align: 'center',
      width: 40,
    },
    {
      title: 'QUANTITY ACCOMPLISHMENT',
      children: [
        {
          title: 'Previous',
          dataIndex: 'qty',
          align: 'center',
          width: 50,
        },
        {
          title: 'This Period',
          dataIndex: 'unit',
          align: 'center',
          width: 50,
        },
        {
          title: 'To Date',
          dataIndex: 'amount',
          align: 'center',
          width: 50,
        },
        {
          title: 'Balance',
          dataIndex: 'amount',
          align: 'center',
          width: 50,
        },
      ],
    },
    {
      title: 'AMOUNT ACCOMPLISHMENT',
      children: [
        {
          title: 'Previous',
          dataIndex: 'qty',
          align: 'center',
          width: 50,
        },
        {
          title: 'This Period',
          dataIndex: 'unit',
          align: 'center',
          width: 50,
        },
        {
          title: 'To Date',
          dataIndex: 'amount',
          align: 'center',
          width: 50,
        },
        {
          title: 'Balance',
          dataIndex: 'amount',
          align: 'center',
          width: 50,
        },
      ],
    },
    {
      title: 'PERCENTAGE',
      dataIndex: 'percentage',
      align: 'center',
      width: 50,
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={[]}
      bordered
      size='small'
      scroll={{ x: 'calc(1600px + 50%)', y: 240 }}
    />
  )
}
