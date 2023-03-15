import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Dropdown, Menu, Button, Input, message, Divider } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from '@ant-design/icons';
import { dialogHook } from "../../../util/customhooks";
import ItemForm from './dialogs/itemForm';
import ColTitlePopUp from '../../../app/components/common/ColTitlePopUp';
import { col2 } from '../../../shared/constant';
import FilterSelect from '../../../util/customForms/filterSelect';
import AssignItemForm from './dialogs/assignItemForm';
import AssignSupplierItemForm from './dialogs/assignSupplierItemForm';


const { Search } = Input;
const options = [
    'Edit',
    'Assign Item',
    'Assign Supplier',
];

//graphQL Queries
const GET_RECORDS = gql`
query($filter: String, $groupId: UUID, $category: [UUID], $page: Int, $size: Int ) {
    list: itemByFiltersPage(filter: $filter, group: $groupId, category: $category,page: $page, size: $size) {
        content{
            id
            sku
            itemCode
            item_group{
                id
                itemDescription
            }
            item_category{
                id
                categoryDescription
            }
            descLong
            brand
            unitMeasurement
            unit_of_purchase{
                id
                unitDescription
            }
            unit_of_usage{
                id
                unitDescription
            }
            item_generics{
                id
                genericDescription
            }
            item_conversion
            item_maximum
            item_demand_qty
            actualUnitCost
            item_markup
            markupLock
            isMedicine
            vatable
            consignment
            discountable
            production
            active
        }
        totalElements,
        totalPages,
        size,
        number
    }
    groups: itemGroupActive
    {
        value: id
		label: itemDescription
    }
    categories: itemCategoryActive(id: $groupId)
    {
        value: id
		label: categoryDescription
    }

}`;

const ItemContent = ({ account }) => {

    const [category, setCategory] = useState([])
    const [groupId, setGroupId] = useState(null)
    const [state, setState] = useState({
        filter: "",
        page: 0,
        size: 10,
    })
    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            filter: state.filter,
            groupId: groupId,
            category: category,
            page: state.page,
            size: state.size,
        },
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(ItemForm, (result) => { // item form
        if (result) {
            message.success(result);
            refetch()
        }
    });

    const [modalAssignItem, showModalAssignItem] = dialogHook(AssignItemForm, (result) => { // item form
        if (result) {
            refetch()
        }
    });

    const [modalAssignSupplierItem, showModalAssignSupplierItem] = dialogHook(AssignSupplierItemForm, (result) => { // item form
        if (result) {
            refetch()
        }
    });

    //======================= =================== =================================================//
    const menus = (record) => (<Menu onClick={(e) => {
        if (e.key === 'Edit') {
            showModal({ show: true, myProps: record })
        } else if (e.key === 'Assign Item') {
            showModalAssignItem({ show: true, myProps: record })
        } else if (e.key === 'Assign Supplier') {
            showModalAssignSupplierItem({ show: true, myProps: record })
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
        title: 'Category',
        dataIndex: 'item_category.categoryDescription',
        key: 'item_category.categoryDescription',
        render: (text, record) => (
            <span>{record.item_category.categoryDescription}</span>
        )
    },
    {
        title: 'Status',
        dataIndex: 'active',
        key: 'active',
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
        <Card title="Item MasterFile List" size="small"
            extra={
                <Button size="small" type="primary" icon={<PlusCircleOutlined />} className="margin-0"
                    onClick={() => showModal({ show: true, myProps: null })}
                >
                    New Item
                </Button>
            }>
            <Row>
                <Col span={24}>
                    <Search placeholder="Search Items"
                        onSearch={(e) => setState({ ...state, filter: e })}
                        enterButton
                    />
                </Col>
                <Col {...col2}>
                    <FilterSelect
                        loading={loading}
                        field="itemGroup"
                        placeholder="Filter Group"
                        onChange={(e) => {
                            setGroupId(e)
                        }}
                        list={_.get(data, "groups")}
                    />
                </Col>
                <Col {...col2}>
                    <FilterSelect
                        loading={loading}
                        field="itemCategory"
                        mode="multiple"
                        placeholder="Filter Categories"
                        list={_.get(data, "categories")}
                        onChange={(e) => {
                            setCategory(e)
                        }}
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
            {modalAssignItem}
            {modalAssignSupplierItem}
        </Card>
    )
};

export default ItemContent;
