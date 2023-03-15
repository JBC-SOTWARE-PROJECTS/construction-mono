import React from 'react';
import { Card, Row, Col, Table, Button, Tag, message, Modal } from 'antd';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { dialogHook } from '../../util/customhooks';
import { ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from "moment";
import { getUrlPrefix } from '../../shared/global';
import RemarksForm from './dialogs/remarksForm';



//graphQL Queries
const GET_RECORDS = gql`
{
    list: shiftPerEmp {
        id
        terminal{
            id
            terminal_no
        }
        shiftNo
        active
        startShift
        endShift
        remarks
        employee{
            id
            fullName
        }
    }
}`;

const CLOSESHIFT = gql`
	mutation{
		upsert: closeShift{
			id
		}
	}
`;

const { confirm } = Modal;

const CollectionContent = ({ account }) => {

    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(RemarksForm, (result) => {
        if (result) {
            message.success(result);
            refetch()
        }
    });

    const [upsertRecord, { loading: upsertLoading }] = useMutation(CLOSESHIFT, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                message.success("Shift successfully close.")
                refetch()
            }
        }
    });
    // ===================================================//
    const onClose = () => {
        upsertRecord()
    }


    const showConfirm = () => {
        confirm({
            title: 'Are you sure you want to close your current shift?',
            content: 'Once proceed it will close emediately.',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(onClose() ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors! Please Contact Administrator'));
            },
            onCancel() { },
        });
    }

    const columns = [
        {
            title: 'Terminal #',
            key: 'terminal_no',
            render: (txt, record) => (
                <span>{record.terminal?.terminal_no}</span>
            )
        },
        {
            title: 'Shift #',
            dataIndex: 'shiftNo',
            key: 'shiftNo',
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            render: (active) => (
                <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>
            )
        },
        {
            title: 'Start Shift',
            dataIndex: 'startShift',
            key: 'startShift',
            render: (startShift) => (
                <span>{startShift && moment(startShift).format("MM/DD/YYYY h:mm:ss A")}</span>
            )
        },
        {
            title: 'End Shift',
            dataIndex: 'endShift',
            key: 'endShift',
            render: (endShift) => (
                <span>{endShift && moment(endShift).format("MM/DD/YYYY h:mm:ss A")}</span>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (txt, record) => (
                [<Button
                    key='btn1'
                    type='primary'
                    size='small'
                    onClick={() => window.open(`${getUrlPrefix()}/reports/billing/print/collections/${record.id}`)}
                >
                    Print
                </Button>,
                <span key='space'>&nbsp;</span>,
                <Button
                    key='btn2'
                    type='primary'
                    size='small'
                    onClick={() => showModal({ show: true, myProps: record })}
                >
                    Remarks
                </Button>]
            )
        },
    ]

    return (
        <Card title="Collection Report" size="small"
            extra={
                <Button size='small' type='danger' icon={<CloseCircleOutlined />} className="margin-0"
                    onClick={() => showConfirm()}
                    loading={upsertLoading}
                >
                    Close Current Shift
                </Button>
            }>
            <Row>
                <Col span={24}>
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
            {modal}
        </Card>
    )
};

export default CollectionContent;
