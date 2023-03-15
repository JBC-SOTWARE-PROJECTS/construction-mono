import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Input, Divider, Menu, Dropdown, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from '@ant-design/icons';
import { dialogHook } from '../../util/customhooks';
import TermninalForm from './dialogs/terminalForm';


const { Search } = Input;

const options = [
    'Edit',
];

//graphQL Queries
const GET_RECORDS = gql`
query($filter: String) {
    list: terminalFilter(filter: $filter) {
        id
        terminal_no
        description
        mac_address
        employee{
            id
            fullName
        }
    }
}`;



const TerminalContent = ({ account }) => {

    const [filter, setFilter] = useState("");
    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            filter: filter
        },
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(TermninalForm, (result) => {
        if (result) {
            message.success(result);
            refetch()
        }
    });
    // ===================================================//

    const menus = (record) => (<Menu onClick={(e) => {
        if (e.key === 'Edit') {
            showModal({ show: true, myProps: record })
        }
    }
    }>
        {options.map(option =>
            <Menu.Item key={option}>
                {option}
            </Menu.Item>,
        )}
    </Menu>);

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
            render: (txt, record) => (
                <span>{record.employee?.fullName}</span>
            )
        },
        {
            title: '#',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Dropdown overlay={menus(record)} placement="bottomRight" trigger={['click']}>
                        <i className="gx-icon-btn icon icon-ellipse-v" />
                    </Dropdown>
                </span>
            ),
        }
    ];

    return (
        <Card title="Cashier Terminal Setup" size="small"
            extra={
                <Button size="small" type="primary" icon={<PlusCircleOutlined />} className="margin-0"
                    onClick={() => showModal({ show: true, myProps: null })}
                    disabled={_.indexOf(account?.user?.access, 'create_terminal') <= -1}
                >
                    Add New Terminal
                </Button>
            }>
            <Row>
                <Col span={24}>
                    <Search placeholder="Search Terminals"
                        onSearch={(e) => setFilter(e)}
                        enterButton
                    />
                </Col>
                <Col span={24}>
                    <Divider />
                    <Table
                        loading={loading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={_.get(data, "list")}
                        rowKey={record => record.id}
                        size="small"
                    />
                </Col>
            </Row>
            {modal}
        </Card>
    )
};

export default TerminalContent;
