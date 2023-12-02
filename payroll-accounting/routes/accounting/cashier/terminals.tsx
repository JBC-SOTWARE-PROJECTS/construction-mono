import React, { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Input,
  Divider,
  Menu,
  Dropdown,
  message,
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import { useDialog } from '@/hooks'
import TerminalForm from '@/components/accounting/cashier/dialog/terminalForm'
import { Terminal } from '@/graphql/gql/graphql'
import _ from 'lodash'

const { Search } = Input

const options = ['Edit']

//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String) {
    list: terminalFilter(filter: $filter) {
      id
      terminal_no
      description
      mac_address
      employee {
        id
        fullName
      }
    }
  }
`

const TerminalContent = ({ account }: any) => {
  const [filter, setFilter] = useState('')
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
    },
    fetchPolicy: 'network-only',
  })

  const terminalDialog = useDialog(TerminalForm)
  //
  // ===================================================//

  const menus = (record: Terminal) => (
    <Menu
      onClick={(e) => {
        if (e.key === 'Edit') {
          terminalDialog({ record }, () => refetch())
        }
      }}
    >
      {options.map((option) => (
        <Menu.Item key={option}>{option}</Menu.Item>
      ))}
    </Menu>
  )

  const columns = [
    {
      title: 'Terminal #',
      dataIndex: 'terminal_no',
      key: 'terminal_no',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Assign Employee',
      dataIndex: 'employee.fullName',
      key: 'employee.fullName',
      render: (_: any, record: Terminal) => (
        <span>{record.employee?.fullName}</span>
      ),
    },
    {
      title: '#',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: Terminal) => (
        <span>
          <Dropdown
            overlay={menus(record)}
            placement='bottomRight'
            trigger={['click']}
          >
            <i className='gx-icon-btn icon icon-ellipse-v' />
          </Dropdown>
        </span>
      ),
    },
  ]

  return (
    <Card
      title='Cashier Terminal Setup'
      size='small'
      extra={
        <Button
          size='small'
          type='primary'
          icon={<PlusCircleOutlined />}
          className='margin-0'
          onClick={() => terminalDialog({}, () => refetch())}
        >
          Add New Terminal
        </Button>
      }
    >
      <Row>
        <Col span={24}>
          <Search
            placeholder='Search Terminals'
            onSearch={(e) => setFilter(e)}
            enterButton
          />
        </Col>
        <Col span={24}>
          <Divider />
          <Table
            loading={loading}
            className='gx-table-responsive'
            columns={columns}
            dataSource={_.get(data, 'list')}
            rowKey={(record) => record.id}
            size='small'
          />
        </Col>
      </Row>
    </Card>
  )
}

export default TerminalContent
