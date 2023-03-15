import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Input, Divider, Menu, Dropdown, message, Tag } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from '@ant-design/icons';
import { dialogHook } from '../../util/customhooks';
import numeral from 'numeral';
import ServiceForm from './dialogs/serviceForm';
import ConfigureItems from './dialogs/configureItems';


const { Search } = Input;

const options = [
    'Edit',
    'Configure'
];

//graphQL Queries
const GET_RECORDS = gql`
query($filter: String, $page: Int, $size: Int ) {
    list: servicePageAll(filter: $filter, page: $page, size: $size) {
        content{
            id
            code
            description
            office {
                id
                officeDescription
            }
            type
            available
            cost
            govCost
        }
        size
        totalElements
        number
    }

}`;



const ServiceContent = ({ account }) => {

    const [filter, setFilter] = useState("");
    const [state, setState] = useState({
        page: 0,
        size: 20,
    })
    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            filter: filter,
            page: state.page,
            size: state.size,
        },
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(ServiceForm, (result) => {
        if (result) {
            message.success(result);
            refetch()
        }
    });

    const [modalConfigure, showConfigureModal] = dialogHook(ConfigureItems, (result) => {
        if (result) {
            message.success(result);
            refetch()
        }
    });
    // ===================================================//
    const disabledMenu = (option, record) => {
        let result = false;
        if (option === "Configure") {
            result = record.type === "SINGLE";
        }
        return result;
    }

    const menus = (record) => (<Menu onClick={(e) => {
        if (e.key === 'Edit') {
            showModal({ show: true, myProps: record })
        } else if (e.key === 'Configure') {
            showConfigureModal({ show: true, myProps: record })
        }
    }
    }>
        {options.map(option =>
            <Menu.Item key={option} disabled={disabledMenu(option, record)}>
                {option}
            </Menu.Item>,
        )}
    </Menu>);

    const columns = [
        {
            title: 'Service Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Office',
            dataIndex: 'office',
            key: 'office',
            render: (txt, record) => (
                <span>{record.office?.officeDescription}</span>
            )
        },
        {
            title: 'Service Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                let color = type === "SINGLE" ? 'green' : 'blue';
                return (
                    <span>
                        <Tag color={color} key={color}>
                            {type}
                        </Tag>
                    </span>
                )
            },
        },
        {
            title: 'Available',
            dataIndex: 'available',
            key: 'available',
            render: (status) => {
                let color = status ? 'green' : 'red';
                let text = status ? 'YES' : 'NO';
                return (
                    <span>
                        <Tag color={color} key={color}>
                            {text}
                        </Tag>
                    </span>
                )
            },
        },
        {
            title: 'Price',
            dataIndex: 'cost',
            key: 'cost',
            render: (cost) => (
                <span>{numeral(cost).format('0,0.00')}</span>
            )
        },
        {
            title: 'Gov. Price',
            dataIndex: 'govCost',
            key: 'govCost',
            render: (govCost) => (
                <span>{numeral(govCost).format('0,0.00')}</span>
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
        <Card title="Service Management" size="small"
            extra={
                <Button size="small" type="primary" icon={<PlusCircleOutlined />} className="margin-0"
                    onClick={() => showModal({ show: true, myProps: null })}
                >
                    Add New Service
                </Button>
            }>
            <Row>
                <Col span={24}>
                    <Search placeholder="Search Services"
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
                        dataSource={_.get(data, "list.content", [])}
                        rowKey={record => record.id}
                        size="small"
                        pagination={{
                            pageSize: _.get(data, 'list.size', 0),
                            total: _.get(data, 'list.totalElements', 0),
                            defaultCurrent: _.get(data, 'list.number', 0) + 1,
                            onChange: (page) => {
                                setState({ ...state, page: page - 1 })
                            }
                        }}
                    />
                </Col>
            </Row>
            {modal}
            {modalConfigure}
        </Card>
    )
};

export default ServiceContent;
