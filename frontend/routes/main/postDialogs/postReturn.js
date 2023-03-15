import React, { useState, useEffect } from "react";
import { Col, Row, Button, Table, Tag } from "antd";
import CModal from "../../../app/components/common/CModal";
import ColTitlePopUp from '../../../app/components/common/ColTitlePopUp';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import numeral from "numeral";
import moment from "moment";
import { postRetObj } from "../../../shared/constant";

const GET_RECORDS = gql`
query( $id: UUID) {
    items: rtsItemByParent(id: $id) {
        id
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
        uou
        returnQty
        returnUnitCost
        return_remarks
        isPosted
    }

}`;

const POST_REC = gql`
 mutation($items: [Map_String_ObjectScalar], $parentId: UUID) {
     upsert: postInventoryLedgerReturn(items: $items, parentId: $parentId) {
         id
	}
}`;


const PostSupplierReturns = ({ visible, hide, ...props }) => {

    const [items, setItems] = useState([])

    const { loading, data } = useQuery(GET_RECORDS, {
        variables: {
            id: props?.id,
        },
        fetchPolicy: 'network-only',
    });

    const [postToLedger, { loading: postLoading }] = useMutation(POST_REC, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                hide("Return to Supplier Posted")
            }
        }
    });


    //======================= =================== =================================================//

    const onSubmit = (e) => {
        console.log("props => ", props)
        console.log("post => ", e)
        postToLedger({
            variables: {
                items: e,
                parentId: props?.id,
            }
        })
    }

    const columns = [{
        title: 'Office',
        dataIndex: 'source',
        key: 'source',
        render: (text, record) => (
            <span key={text}>{record?.source?.officeDescription}</span>
        )
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (date) => (
            <span key={date}>{moment(date).format("YYYY-MM-DD HH:mm:ss")}</span>
        )
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (type) => {
            return (
                <span>
                    <Tag color={"green"} key={"green"}>
                        {type}
                    </Tag>
                </span>
            )
        },
    },
    {
        title: 'Item Description',
        dataIndex: 'descLong',
        key: 'descLong',
        render: (text, record) => (
            <span key={text}>{record?.item?.descLong}</span>
        )
    },
    {
        title: <ColTitlePopUp descripton="Unit (UoU)" popup="Unit of Usage" />,
        dataIndex: 'item.unit_of_usage.unitDescription',
        key: 'item.unit_of_usage.unitDescription',
        render: (text, record) => (
            <span key={text}>{record?.item?.unit_of_usage?.unitDescription}</span>
        )
    },
    {
        title: <ColTitlePopUp descripton="Qty (UoU)" popup="Unit of Usage" />,
        dataIndex: 'qty',
        key: 'qty',
        render: (qty) => (
            <span>{numeral(qty).format('0,0')}</span>
        )
    },
    {
        title: <ColTitlePopUp descripton="Unit Cost (UoU)" popup="Unit of Usage" />,
        dataIndex: 'unitcost',
        key: 'unitcost',
        render: (unitcost) => (
            <span>{numeral(unitcost).format('0,0.00')}</span>
        )
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            let color = status === true ? 'green' : 'blue';
            let text = status === true ? 'POSTED' : 'NEW';
            return (
                <span>
                    <Tag color={color} key={color}>
                        {text}
                    </Tag>
                </span>
            )
        },
    },];

    //map
    useEffect(() => {
        if (_.get(data, "items")) {
            let payload = [];
            (data?.items || []).map(async (e, i) => {
                console.log("index => ", i)
                let obj = postRetObj("RTS", e, props, i)
                payload.push(obj);
            });
            setItems(payload);
        }
    }, [data])


    return (
        <CModal
            width={"70%"}
            title={"Post Inventory"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button key="submit" type="primary" onClick={() => onSubmit(items)} loading={postLoading} disabled={props?.isPosted}>
                    Submit
                </Button>,
            ]}
        >
            <Row>
                <Col span={24}>
                    <Table
                        loading={loading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={items}
                        rowKey={record => record.id}
                        size="small"
                    />
                </Col>
            </Row>
        </CModal>
    );
};

export default (PostSupplierReturns);
