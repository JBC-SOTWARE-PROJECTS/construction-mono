import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Dropdown, Menu, Button, Input, message, Divider, Modal } from 'antd';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { dialogHook } from "../../../util/customhooks";
import { col4, col18 } from '../../../shared/constant';
import FilterSelect from '../../../util/customForms/filterSelect';
import { getUrlPrefix } from '../../../shared/global'
import POForm from './dialogs/poForm';
import moment from "moment";


const { Search } = Input;
const { confirm } = Modal
const options = [
    'Edit',
    'Approve',
    'Void',
    'Print',
];

//graphQL Queries
const GET_RECORDS = gql`
query($filter: String, $office: UUID, $page: Int, $size: Int ) {
    list: poByFiltersPage(filter: $filter, office: $office,page: $page, size: $size) {
        content{
            id
            poNumber
            preparedDate
            etaDate
            supplier{
                id
                supplierFullname
            }
            paymentTerms{
                id
                paymentDesc
            }
            prNos
            office{
                id
                officeDescription
            }
            remarks
            isApprove
            status
            userId
            preparedBy
            noPr
            isCompleted
            isVoided
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

const UPSERT_RECORD = gql`
 mutation($status: Boolean, $id: UUID) {
     upsert: updatePOStatus(status: $status, id: $id) {
         id
	}
}`;

const POContent = ({ account }) => {

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
            page: state.page,
            size: state.size,
        },
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(POForm, (result) => { // item form
        if (result) {
            message.success(result);
            refetch()
        }
    });

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                message.success("Purchase Order Information Updated")
                refetch()
            }
        }
    });


    //======================= =================== =================================================//
    const _approve = (id, status, message) => {
        confirm({
            title: `Do you want ${message} this Purchase Order?`,
            icon: <ExclamationCircleOutlined />,
            content: 'Please click ok to proceed.',
            onOk() {
                upsertRecord({
                    variables: {
                        status: status,
                        id: id,
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }

    const disabledMenu = (option, record) => {
        let result = false;
        if (option === "Void") {
            if (_.indexOf(account?.user?.access, 'po_approver') > -1) {
                result = !record?.isApprove
            } else {
                result = true;
            }
        } else if (option === "Approve") {
            if (_.indexOf(account?.user?.access, 'po_approver') > -1) {
                result = record?.isApprove || record?.isVoided
            } else {
                result = true;
            }
        }
        return result;
    }

    const menus = (record) => (<Menu onClick={(e) => {
        if (e.key === 'Edit') {
            showModal({ show: true, myProps: record })
        } else if (e.key === 'Approve') {
            _approve(record?.id, true, "aprrove")
        } else if (e.key === 'Void') {
            _approve(record?.id, false, "void")
        } else if (e.key === 'Print') {
            window.open(`${getUrlPrefix()}/reports/inventory/print/po_report/${record.id}`);
        }
    }
    }>
        {options.map(option =>
            <Menu.Item key={option} disabled={disabledMenu(option, record)}>
                {option}
            </Menu.Item>,
        )}
    </Menu>);


    const columns = [{
        title: 'PO Date',
        dataIndex: 'preparedDate',
        key: 'preparedDate',
        render: (text, record) => (
            <span>{moment(record?.preparedDate).format("MMM DD, YYYY")}</span>
        )
    },
    {
        title: 'PO #',
        dataIndex: 'poNumber',
        key: 'poNumber',
    },
    {
        title: "PR No's",
        dataIndex: 'prNos',
        key: 'prNos',
    },
    {
        title: 'Supplier',
        dataIndex: 'supplier.supplierFullname',
        key: 'supplier',
        render: (text, record) => (
            <span>{record?.supplier?.supplierFullname}</span>
        )
    },
    {
        title: 'Status',
        dataIndex: 'isApprove',
        key: 'isApprove',
        render: (status, record) => {
            let color = status === true ? 'cyan' : 'orange';
            if (record.isCompleted) {
                color = 'green';
            } else if (record.isVoided) {
                color = 'red';
            }
            return (
                <span>
                    <Tag color={color} key={color}>
                        {record?.status}
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
        <Card title="Purchase Order List" size="small"
            extra={
                <span>
                    <Button size="small" type="primary" icon={<PlusCircleOutlined />} className="margin-0"
                        onClick={() => showModal({ show: true, myProps: null })}
                    >
                        New Purchase Order
                    </Button>
                </span>
            }>
            <Row>
                <Col {...col18}>
                    <Search placeholder="Search Purchase Order"
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
            {modal}
        </Card>
    )
};

export default POContent;
