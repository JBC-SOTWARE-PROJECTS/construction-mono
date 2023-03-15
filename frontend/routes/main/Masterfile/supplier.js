import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Dropdown, Menu, Button, Input, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from '@ant-design/icons';
import { dialogHook } from "../../../util/customhooks";
import SupplierForm from './dialogs/supplierForm';
import { useRouter } from 'next/router';


const { Search } = Input;
const options = [
    'Edit',
    'View Supplier Item',
];

//graphQL Queries
const GET_RECORDS = gql`
query($filter: String) {
    list: supplierList(filter: $filter) {
        id
        supplierCode
        supplierFullname
        supplierTin
        supplierEmail
        paymentTerms{
            id
            paymentDesc
        }
        supplierEntity
        supplierTypes{
            id
            supplierTypeDesc
        }
        creditLimit
        isVatable
        isVatInclusive
        remarks
        leadTime
        primaryAddress
        primaryTelphone
        primaryContactPerson
        primaryFax
        secondaryAddress
        secondaryTelphone
        secondaryContactPerson
        secondaryFax
        isActive
    }
}`;

const SupplierContent = ({ account }) => {
    const router = useRouter();
    const [filter, setFilter] = useState("");
    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            filter: filter
        },
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(SupplierForm, (result) => {
        if (result) {
            message.success(result);
            refetch()
        }
    });

    //======================= =================== =================================================//
    const menus = (record) => (<Menu onClick={(e) => {
        if (e.key === 'Edit') {
            showModal({ show: true, myProps: record })
        } else {
            router.push(`/main/masterfile/suppliers/${record?.id}`)
        }
    }
    }>
        {options.map(option =>
            <Menu.Item key={option}>
                {option}
            </Menu.Item>,
        )}
    </Menu>);


    const columns = [{
        title: 'Supplier Code',
        dataIndex: 'supplierCode',
        key: 'supplierCode',
    },
    {
        title: 'Supplier Name',
        dataIndex: 'supplierFullname',
        key: 'supplierFullname',
    },
    {
        title: 'Contact No.',
        dataIndex: 'primaryTelphone',
        key: 'primaryTelphone',
    },
    {
        title: 'Email Address',
        dataIndex: 'supplierEmail',
        key: 'supplierEmail',
    },
    {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: status => (
            <span>
                <Tag color={status === true ? 'green' : 'red'} key={status}>
                    {status === true ? 'Active' : 'Inactive'}
                </Tag>
            </span>
        ),
    }, {
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
    }];

    return (
        <Card title="Supplier List" size="small"
            extra={
                <Button size="small" type="primary" icon={<PlusCircleOutlined />} className="margin-0"
                    onClick={() => showModal({ show: true, myProps: null })}
                >
                    New Supplier
                </Button>
            }>
            <Row>
                <Col span={24}>
                    <Search placeholder="Search Supplier"
                        onSearch={(e) => setFilter(e)}
                        enterButton
                    />
                </Col>
                <Col span={24}>
                    <Table
                        loading={loading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={_.get(data, "list", [])}
                        rowKey={record => record.id}
                        size="small"
                    />
                </Col>
            </Row>
            {modal}
        </Card>
    )
};

export default SupplierContent;
