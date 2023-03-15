import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Dropdown, Menu, Button, Input, message, Divider, Modal } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp"
import { dialogHook } from "../../../util/customhooks";
import { col4, col18 } from '../../../shared/constant';
import FilterSelect from '../../../util/customForms/filterSelect';
import numeral from 'numeral';
import BeginningForm from './dialogs/beginningForm';


const { Search } = Input;

const options = [
    'View Transaction',
];

//graphQL Queries
const GET_RECORDS = gql`
query($filter: String, $office: UUID,  $groupId: UUID, $category: [UUID], $page: Int, $size: Int) {
    list: inventoryListPageableByDep(filter: $filter, office: $office,  group: $groupId, category: $category,page: $page, size: $size) {
        content{
            id
            sku
            item {
                id
                descLong
                item_conversion
                vatable
                unit_of_usage{
				  id
				  unitDescription
				}
            }
            descLong
            unitMeasurement
            brand
            onHand
            reOrderQty
            status
            wcost: last_wcost
            unitCost: lastUnitCost
        }
        size
        totalElements
        number
    }
    offices: activeOffices
    {
        value: id
		label: officeDescription
    }

}`;


const BeginningContent = ({ account }) => {

    const [office, setOffice] = useState(account?.office?.id)
    const [state, setState] = useState({
        filter: "",
        page: 0,
        size: 20,
    })
    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            filter: state.filter,
            office: office,
            groupId: null,
            category: [],
            page: state.page,
            size: state.size,
        },
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(BeginningForm, (result) => { // item form
        if (result) {
            message.success(result);
            refetch()
        } else {
            refetch()
        }
    });


    const menus = (record) => (<Menu onClick={(e) => {
        if (e.key === 'View Transaction') {
            showModal({ show: true, myProps: { ...record, office: { id: office } } })
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
        title: 'SKU/Barcode',
        dataIndex: 'sku',
        key: 'sku',
    },
    {
        title: 'Description',
        dataIndex: 'descLong',
        key: 'descLong',
    },
    {
        title: <ColTitlePopUp descripton="Unit of Measurement (UoP/UoU)" popup="Unit of Purchase/Unit of Usage" />,
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
    },
    {
        title: 'Critical Level',
        dataIndex: 'reOrderQty',
        key: 'reOrderQty',
        render: (reOrderQty) => (
            <span>{numeral(reOrderQty).format('0,0')}</span>
        )
    }, {
        title: <ColTitlePopUp descripton="On Hand Qty (UoU)" popup="Unit of Usage" />,
        dataIndex: 'onHand',
        key: 'onHand',
        align: "right",
        render: (onHand) => (
            <span>{numeral(onHand).format('0,0')}</span>
        )
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            let color = status === "Healthy" ? 'green' : 'orange';
            if (status === "No Stock") {
                color = 'red';
            }
            return (
                <span>
                    <Tag color={color} key={color}>
                        {status}
                    </Tag>
                </span>
            )
        },
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
        <Card title="Setup Beginning Balance" size="small">
            <Row>
                <Col {...col18}>
                    <Search placeholder="Search Items"
                        onSearch={(e) => setState({ ...state, filter: e })}
                        enterButton
                    />
                </Col>
                <Col {...col4}>
                    <FilterSelect
                        allowClear
                        defaultValue={account?.office?.id}
                        loading={loading}
                        field="office"
                        placeholder="Filter By Office"
                        onChange={(e) => {
                            setOffice(e)
                        }}
                        list={_.get(data, "offices")}
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
        </Card>
    )
};

export default BeginningContent;
