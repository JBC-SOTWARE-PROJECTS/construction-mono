import React, { useState } from "react";
import { Col, Row, Button, Table, Input, Tag } from "antd";
import CModal from "../../../../app/components/common/CModal";
import ColTitlePopUp from '../../../../app/components/common/ColTitlePopUp';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import numeral from "numeral";


const { Search } = Input;

const GET_RECORDS = gql`
query($filter: String, $id: UUID) {
    list: getPOMonitoringByPoItemFilter(filter: $filter, id: $id) {
        id
        receivingReport {
            rrNo
            receivedRefNo
        }
        receivingReportItem {
            id
            item {
                id
                unit_of_usage{
				    id
				    unitDescription
			    }
            }
        }
        quantity
        status
    }

}`;

const ViewPOMonitoring = ({ visible, hide, ...props }) => {

    const [state, setState] = useState({
        filter: "",
    })

    const { loading, data } = useQuery(GET_RECORDS, {
        variables: {
            filter: state.filter,
            id: props?.id,
        }
    });

    //======================= =================== =================================================//


    const columns = [{
        title: 'SRR #',
        dataIndex: 'receivingReport.rrNo',
        key: 'receivingReport.rrNo',
        render: (text, record) => (
            <span key={text}>{record?.receivingReport?.rrNo}</span>
        )
    },
    {
        title: 'Ref #',
        dataIndex: 'receivingReport.receivedRefNo',
        key: 'receivingReport.receivedRefNo',
        render: (text, record) => (
            <span key={text}>{record?.receivingReport?.receivedRefNo}</span>
        )
    },
    {
        title: <ColTitlePopUp descripton="Delivered Qty (UoU)" popup="Unit of Usage" />,
        dataIndex: 'quantity',
        key: 'quantity',
        render: (quantity) => (
            <span>{numeral(quantity).format('0,0')}</span>
        )
    },
    {
        title: <ColTitlePopUp descripton="Rec. Unit (UoU)" popup="Unit of Usage" />,
        dataIndex: 'receivingReportItem',
        key: 'receivingReportItem',
        render: (text, record) => (
            <span key={text}>{record?.receivingReportItem?.item?.unit_of_usage?.unitDescription}</span>
        )
    },
    {
        title: "Status",
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            let color = status === "DELIVERED" ? 'green' : 'orange';
            return (
                <span>
                    <Tag color={color} key={color}>
                        {status}
                    </Tag>
                </span>
            )
        },
    }];


    return (
        <CModal
            width={"70%"}
            title={"Deliveries"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>
            ]}
        >
            <Row>
                <Col span={24}>
                    <Search placeholder="Search Deliveries"
                        onSearch={(e) => setState({ ...state, filter: e })}
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
        </CModal>
    );
};

export default (ViewPOMonitoring);
