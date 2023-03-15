import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Input, InputNumber, message, Divider, Tag } from 'antd';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp"
import { col4, col18 } from '../../../shared/constant';
import FilterSelect from '../../../util/customForms/filterSelect';
import numeral from 'numeral';


const { Search } = Input;

//graphQL Queries
const GET_RECORDS = gql`
query($filter: String, $office: UUID,  $groupId: UUID, $category: [UUID], $page: Int, $size: Int) {
    list: inventoryListPageableByDep(filter: $filter, office: $office,  group: $groupId, category: $category,page: $page, size: $size) {
        content{
            id
            sku
            descLong
            item {
                id
                descLong
                item_conversion
                vatable
                unit_of_usage{
				  id
				  unitDescription
				}
                item_category {
                    id
                    categoryDescription
                }
            }
            reOrderQty
            onHand
            status
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


const UPSERT_QTY = gql`
 mutation($value: Int, $id: UUID) {
     upsert: updateReOrderQty(value: $value, id: $id) {
         id
	}
}`;


const InvMonitoringContent = ({ account }) => {

    const [office, setOffice] = useState(account?.office?.id)
    const [editable, setEditable] = useState({})
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


    const [upsertQty, { loading: upsertLoading }] = useMutation(UPSERT_QTY, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                message.success("Critical Level Updated")
                refetch()
            }
        }
    });


    const onChangeArray = (element, record, newValue) => {
        upsertQty({
            variables: {
                value: parseInt(newValue),
                id: record?.id,
            }
        })
    }

    const colInput = (record, el) => {
        return (
            <InputNumber
                defaultValue={record[el]}
                size="small"
                autoFocus
                onBlur={(e) => {
                    let newValue = e?.target?.value;
                    onChangeArray(el, record, newValue);
                    setEditable({ ...editable, [record.id + el]: false })
                }}
                style={{ width: 150 }}
            />
        )

    }


    const columns = [
        {
            title: 'Description',
            dataIndex: 'descLong',
            key: 'descLong',
        },

        {
            title: "Category",
            dataIndex: 'categoryDescription',
            key: 'categoryDescription',
            render: (text, record) => (
                <span key={text}>{record?.item?.item_category?.categoryDescription}</span>
            )
        },
        {
            title: <ColTitlePopUp descripton="Unit (UoU)" popup="Unit of Usage" />,
            dataIndex: 'unitDescription',
            key: 'unitDescription',
            render: (text, record) => (
                <span key={text}>{record?.item?.unit_of_usage?.unitDescription}</span>
            )
        },
        {
            title: <ColTitlePopUp descripton="Critical Level" editable={true} />,
            dataIndex: 'reOrderQty',
            key: 'reOrderQty',
            align: "right",
            onCell: (e) => {
                return {
                    onDoubleClick: () => {
                        setEditable({ ...editable, [e.id + "reOrderQty"]: true })
                    }, // double click row
                };
            },
            render: (text, record) => {
                return editable[record.id + "reOrderQty"] ? (
                    colInput(record, "reOrderQty")
                ) : (
                    <span key={text}>{numeral(record.reOrderQty).format('0,0')}</span>
                )
            }
        },
        {
            title: "On Hand",
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
        }
    ];


    return (
        <Card title="Inventory Monitoring" size="small">
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
                        loading={loading || upsertLoading}
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
        </Card>
    )
};

export default InvMonitoringContent;
