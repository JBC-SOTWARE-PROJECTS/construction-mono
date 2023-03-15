import React, { useState } from "react";
import { Col, Row, Button, Table, Input, Modal, Divider, Typography, Tag, message } from "antd";
import CModal from "../../../app/components/common/CModal";
import { PrinterOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { getUrlPrefix } from "../../../shared/global";
import _ from "lodash"
import numeral from "numeral";



const VOID = gql`
	mutation(
		$paymentId: UUID
	) {
		upsert: voidOr(
			paymentId: $paymentId
		) {
			id
		}
	}
`;

const ORLIST = gql`
	query($id: UUID, $filter: String){
		list: paymentsByShift(id: $id, filter: $filter) {
			id
			receiptType
			totalPayments
			orNumber
			description
			voided
			billingItem {
				id
				recordNo
			}
		}
	}
`;

const { Search } = Input;
const { confirm } = Modal;
const { Text } = Typography;

const VoidOR = ({ visible, hide, ...props }) => {

    const [filter, setFilter] = useState("");


    const { loading, data, refetch } = useQuery(ORLIST, {
        variables: {
            id: props.id,
            filter: filter
        },
        fetchPolicy: 'network-only'
    });
    {/* error = { errorTitle: "", errorMsg: ""}*/ }
    console.log("records => ", props)

    const [upsertRecord, { loading: upsertLoading }] = useMutation(VOID, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                message.success("Successfully Voided OR")
                refetch()
            }
        }
    });

    //======================= =================== =================================================//
    const sumbit = (id) => {
        upsertRecord({
            variables: {
                paymentId: id,
            }
        })
    }

    const showConfirm = (id) => {
        confirm({
            title: 'Are you sure you want to void this OR (Official Receipt)?',
            content: 'Once proceed it will void emediately. Please click with cautions',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(sumbit(id) ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors! Please Contact Administrator'));
            },
            onCancel() { },
        });
    }


    const columns = [
        {
            title: 'Type',
            dataIndex: 'receiptType',
            key: 'receiptType',
            render: (receiptType, record) => (
                <Text type={record.voided && 'danger'} delete={record.voided && true}>{receiptType}</Text>
            )
        },
        {
            title: 'Ref. No.',
            key: 'refNo',
            render: (txt, record) => (
                <Text type={record.voided && 'danger'} delete={record.voided && true}>{record.billingItem?.recordNo}</Text>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'totalPayments',
            key: 'totalPayments',
            render: (cost, record) => (
                <Text type={record.voided && 'danger'} delete={record.voided && true}>{numeral(cost).format('0,0.00')}</Text>
            )
        },
        {
            title: 'Description',
            key: 'description',
            dataIndex: 'description',
            render: (description, record) => (
                <Text type={record.voided && 'danger'} delete={record.voided && true}>{description}</Text>
            )
        },
        {
            title: 'Status',
            dataIndex: 'voided',
            key: 'voided',
            render: (voided) => (
                <Tag color={voided ? "red" : "green"}>{voided ? "Voided" : "Active"}</Tag>
            )
        },
        {
            title: '#',
            key: 'action',
            render: (txt, record) => (
                [<Button
                    key='void'
                    type='danger'
                    size='small'
                    onClick={() => showConfirm(record.id)}
                    disabled={record.voided || (_.indexOf(props?.access, 'void_or') <= -1 && !props?.active)}
                >
                    Void
                </Button>,
                <span key='space'>&nbsp;</span>,
                <Button
                    key='print'
                    type='primary'
                    size='small'
                    icon={<PrinterOutlined />}
                    onClick={() => window.open(`${getUrlPrefix()}/reports/billing/print/receipt/${record.id}`)}
                />]
            )
        },

    ]

    return (
        <CModal
            width={"70%"}
            title={"Void OR/SI"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>
            ]}
        >
            <Row>
                <Col span={24}>
                    <Search placeholder="Search"
                        onSearch={(e) => setFilter(e)}
                        enterButton
                    />
                </Col>
                <Col span={24}>
                    <Divider />
                    <Table
                        loading={loading || upsertLoading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={_.get(data, "list")}
                        rowKey={record => record.id}
                        size="small"
                    />
                </Col>
            </Row>
        </CModal>
    );
};

export default (VoidOR);
