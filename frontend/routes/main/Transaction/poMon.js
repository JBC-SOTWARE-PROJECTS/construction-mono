import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Button, Input, message, Divider } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
// import { PlusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { dialogHook } from "../../../util/customhooks";
import { col4, col18 } from '../../../shared/constant';
import FilterSelect from '../../../util/customForms/filterSelect';
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp";
import numeral from "numeral";
import ViewPOMonitoring from './dialogs/poMonView';


const { Search } = Input;


//graphQL Queries
const GET_RECORDS = gql`
query($id: UUID, $filter: String) {
    list: poItemMonitoringByParentFilter(id: $id, filter: $filter) {
        id
        item{
            id
            descLong
            item_conversion
            vatable
            unit_of_usage{
				id
				unitDescription
			}
        }
        purchaseOrder {
            id
            poNumber
        }
        prNos
        unitMeasurement
        quantity
        unitCost
        qtyInSmall
        deliveredQty
        deliveryBalance
    }
    po: poList
    {
        value: id
		label: poNumber
    }

}`;


const POMonContent = ({ account }) => {

    const [poId, setPOId] = useState(null)
    const [state, setState] = useState({
        filter: "",
    })
    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            filter: state.filter,
            id: poId,
        },
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(ViewPOMonitoring, (result) => { // item form
        if (result) {
            message.success(result);
            refetch()
        }
    });


    //======================= =================== =================================================//

    const columns = [
        {
            title: 'PO #',
            dataIndex: 'purchaseOrder.poNumber',
            key: 'purchaseOrder.poNumber',
            render: (text, record) => (
                <span key={text}>{record?.purchaseOrder?.poNumber}</span>
            )
        },
        {
            title: 'Item Description',
            dataIndex: 'item.descLong',
            key: 'item.descLong',
            render: (text, record) => (
                <span key={text}>{record?.item?.descLong}</span>
            )
        },

        {
            title: "Ref. Nos.",
            dataIndex: 'prNos',
            key: 'prNos',
        },
        {
            title: <ColTitlePopUp descripton="Order Qty (UoP)" popup="Unit of Purchase" />,
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => (
                <span>{numeral(quantity).format('0,0')}</span>
            )
        },
        {
            title: <ColTitlePopUp descripton="Order Qty (UoU)" popup="Unit of Usage" />,
            dataIndex: 'qtyInSmall',
            key: 'qtyInSmall',
            render: (qtyInSmall) => (
                <span>{numeral(qtyInSmall).format('0,0')}</span>
            )
        },
        {
            title: <ColTitlePopUp descripton="Delivered Qty (UoU)" popup="Unit of Usage" />,
            dataIndex: 'deliveredQty',
            key: 'deliveredQty',
            render: (deliveredQty) => (
                <span>{numeral(deliveredQty).format('0,0')}</span>
            )
        },
        {
            title: <ColTitlePopUp descripton="Balance Qty (UoU)" popup="Unit of Usage" />,
            dataIndex: 'deliveryBalance',
            key: 'deliveryBalance',
            render: (deliveryBalance) => (
                <span>{numeral(deliveryBalance).format('0,0')}</span>
            )
        },
        {
            title: '#',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span key={text}>
                    <Button type="danger" size="small"
                        onClick={() => showModal({ show: true, myProps: record })}>
                        View
                    </Button>
                </span>
            ),
        }
    ];

    return (
        <Card title="Purchase Orde Delivery Monitoring" size="small">
            <Row>
                <Col {...col18}>
                    <Search placeholder="Search Purchase Order Items"
                        onSearch={(e) => setState({ ...state, filter: e })}
                        enterButton
                    />
                </Col>
                <Col {...col4}>
                    <FilterSelect
                        allowClear
                        loading={loading}
                        field="po"
                        placeholder="Filter By PO Number"
                        onChange={(e) => {
                            setPOId(e)
                        }}
                        list={_.get(data, "po")}
                    />
                </Col>
                <Col span={24}>
                    <Divider />
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

export default POMonContent;
