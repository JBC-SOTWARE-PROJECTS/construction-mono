import { DeleteOutlined } from '@ant-design/icons'
import { Button, Card, Col, Popconfirm, Row, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useContext } from 'react'
import { ReceivePayCreateContext } from '..'
import {
  getPaymentMethodDesc,
  handleDeletePaymentMethod,
} from '../functions/body'
import { EditableTableCSS } from '../props'
import { PaymentMethodFields } from '../types'

export default function PaymentMethod() {
  const { state, dispatch } = useContext(ReceivePayCreateContext)

  const columns: ColumnsType<PaymentMethodFields> = [
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      render: (text) => text ?? '-',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'right',
      width: 200,
    },
    {
      title: '#',
      dataIndex: 'id',
      width: 50,
      render: (id: string) => (
        <Popconfirm
          title='Sure to delete?'
          onConfirm={() => handleDeletePaymentMethod({ id, state, dispatch })}
        >
          <Button type='link' icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ]

  return (
    <Row>
      <Col flex='auto'>
        <EditableTableCSS>
          <Table
            rowKey='id'
            size='small'
            columns={columns}
            dataSource={state.paymentMethod}
            expandable={{
              expandedRowRender: (record) => (
                <Card size='small' bordered={false}>
                  {getPaymentMethodDesc(record)}
                </Card>
              ),
              rowExpandable: (record) => record.type !== 'CASH',
            }}
            pagination={false}
          />
        </EditableTableCSS>
      </Col>
    </Row>
  )
}
