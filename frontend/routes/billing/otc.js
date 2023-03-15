import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Input, Divider, Typography, Checkbox, Tag } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from '@ant-design/icons';
import { col4, } from '../../shared/constant';
import moment from "moment";
import numeral from 'numeral';
import AddOTC from './dialogs/addOTC';
import { dialogHook } from '../../util/customhooks';


const { Search } = Input;
const { Text } = Typography;

//graphQL Queries
const GET_RECORDS = gql`
query($filter: String, $status: Boolean, $page: Int, $size: Int ) {
    list: billingOTCByFiltersPage(filter: $filter, status: $status, page: $page, size: $size) {
        content{
            id
            dateTrans
            billNo
            otcName
            locked
            lockedBy
            balance
            status
        }
        size
        totalElements
        number
    }
}`;


const BillingContent = ({ account }) => {

    const [state, setState] = useState({
        filter: "",
        status: true,
        page: 0,
        size: 20,
    })
    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            filter: state.filter,
            status: state.status,
            page: state.page,
            size: state.size,
        },
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(AddOTC, (e) => { // item form
        if (e) {
            refetch()
        }
    });
    //======================= =================== =================================================//

    const columns = [
        {
            title: 'Bill #',
            dataIndex: 'billNo',
            key: 'billNo',
            render: (billNo, record) => (
                <Button
                    type='link'
                    size="small"
                    onClick={() => window.open(`/billing/otc/${record.id}`)}
                >
                    {billNo}
                </Button>
            )
        },

        {
            title: 'Customer',
            dataIndex: 'otcName',
            key: 'otcName',
            render: (otcName) => (
                <span>{otcName}</span>
            )
        },
        {
            title: 'Transaction Date',
            dataIndex: 'dateTrans',
            key: 'dateTrans',
            render: (dateTrans) => (
                <span>{moment(dateTrans).format("MM/DD/YYYY h:mm:ss A")}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = status ? "green" : "red";
                let text = status ? "ACTIVE" : "INACTIVE";
                return (
                    <span>
                        <Tag color={color} key={color}>
                            {text}
                        </Tag>
                    </span>
                )
            }
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: (bal) => {
                let style = { color: 'danger' }
                if (bal <= 0) {
                    style = { color: 'success' }
                }
                return (
                    <Text type={style.color}>{numeral(bal).format('0,0.00')}</Text>
                )
            }
        },
    ];

    return (
        <Card title="OTC Accounts" size="small"
            extra={
                <Button size="small" type="primary" icon={<PlusCircleOutlined />} className="margin-0"
                    onClick={() => showModal({ show: true, myProps: null })}
                >
                    Add OTC Transaction
                </Button>
            }>
            <Row>
                <Col span={18}>
                    <Search placeholder="Search OTC Accounts"
                        onSearch={(e) => setState({ ...state, filter: e })}
                        enterButton
                    />
                </Col>
                <Col {...col4}>
                    <Checkbox
                        checked={state.status}
                        onChange={(e) => {
                            setState({ ...state, status: e?.target?.checked })
                        }}
                        style={{ marginTop: 5 }}
                    >
                        Show only active billing
                    </Checkbox>
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

export default BillingContent;
