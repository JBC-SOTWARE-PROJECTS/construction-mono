import React, { useState } from 'react';
import { Table, Col, Row, Tag, Dropdown, Menu, Input, message, Button } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from '@ant-design/icons';
import { dialogHook } from "../../../../util/customhooks";
import _ from "lodash";
import { colSearch, colButton } from '../../../../shared/constant';
import SignatureForm from '../dialogs/signatureForm';


const { Search } = Input;

const options = [
    'Edit',
    'Remove',
];

//graphQL Queries
const GET_RECORDS = gql`
query($type: String!, $filter: String) {
    list: signatureListFilter(type: $type, filter: $filter) {
        id
		signatureType
		signatureHeader
		signaturePerson
		signaturePosition
		currentUsers
		sequence
	}
}`;

const SignatureList = ({ account, type }) => {

    const [filter, setFilter] = useState("");
    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            type: type,
            filter: filter
        },
        fetchPolicy: 'network-only',
    });

    const [modal, showModal] = dialogHook(SignatureForm, (result) => {
        if (result) {
            message.success(result);
            refetch()
        }
    });
    // ===================================================//

    const menus = (record) => (<Menu onClick={(e) => {
        if (e.key === 'Edit') {
            showModal({ show: true, myProps: record })
        } else if (e.key === 'Remove') {

        }
    }
    }>
        {options.map(option =>
            <Menu.Item key={option}>
                {option}
            </Menu.Item>,
        )}
    </Menu>);

    const columns = [
        {
            title: 'Sequence',
            dataIndex: 'sequence',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Signature Header',
            dataIndex: 'signatureHeader',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Signaturies',
            dataIndex: 'signaturePerson',
            render: (text, record) => {
                if (record.currentUsers) {
                    return <Tag color={'green'}>Current user</Tag>;
                } else {
                    return text;
                }
            },
        },
        {
            title: 'Position/Designation',
            dataIndex: 'signaturePosition',
            render: (text, record) => {
                if (record.currentUsers) {
                    return <Tag color={'green'}>Current user</Tag>;
                } else {
                    return text;
                }
            },
        },
        {
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
        <div className="pd-10">
            <Row>
                <Col {...colSearch}>
                    <Search placeholder="Search Signatures"
                        onSearch={(e) => setFilter(e)}
                        enterButton
                    />
                </Col>
                <Col {...colButton}>
                    <Button icon={<PlusCircleOutlined />} type="primary" block onClick={() => showModal({ show: true, myProps: { type: type } })}>
                        New
                    </Button>
                </Col>
                <Col span={24}>
                    <Table
                        loading={loading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={_.get(data, "list")}
                        rowKey={record => record.id}
                        size="small"
                    />
                </Col>
            </Row>
            {/* modal component */}
            {modal}
        </div>

    )
};

export default SignatureList;
