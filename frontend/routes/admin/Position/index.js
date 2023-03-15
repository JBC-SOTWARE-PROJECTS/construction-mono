import React, { useState } from "react";
import { Button, Drawer, message, Table, Tag, Dropdown, Menu } from "antd";
import CustomScrollbars from "../../../util/CustomScrollbars";
import { dialogHook } from "../../../util/customhooks";
import AppModuleHeader from "../../../app/components/AppModuleHeader";
import IntlMessages from "../../../util/IntlMessages";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import './index.css';
import PositionForm from "./PositionForm";


const filterOptions = [
    {
        id: 1,
        name: 'All Positions',
        icon: 'all-contacts',
        status: null,
    }, {
        id: 2,
        name: 'Active Positions',
        icon: 'check-circle-o',
        status: true,

    }, {
        id: 3,
        name: 'Inactive Positions',
        icon: 'close-circle',
        status: false,
    }
];

const options = [
    'Edit',
];

//graphQL Queries
const GET_RECORDS = gql`
query($filter: String, $status: Boolean) {
    list: positionByFilter(filter: $filter, status: $status) {
        id
        code
        description
        status
    }
}`;

const Positions = ({ account }) => { //state first before useQuery
    //state
    const [state, setState] = useState({
        showMessage: false,
        filterStatus: null,
        drawerState: false,
    });
    const [filter, setFilter] = useState("");
    //query
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            filter: filter,
            status: state.filterStatus
        },
        fetchPolicy: 'network-only',
    });
    const [modal, showModal] = dialogHook(PositionForm, (result) => {
        if (result) {
            message.success(result);
            refetch()
        }
    });
    //================================================== ===========================
    //functions
    const menus = (record) => (<Menu onClick={(e) => {
        if (e.key === 'Edit') {
            onAddPosition(record)
        }
    }
    }>
        {options.map(option =>
            <Menu.Item key={option}>
                {option}
            </Menu.Item>,
        )}
    </Menu>);

    const ContactSideBar = () => {
        return <div className="gx-module-side">
            <div className="gx-module-side-header">
                <div className="gx-module-logo">
                    <i className="icon icon-auth-screen gx-mr-4" />
                    <span><IntlMessages id="sidebar.admin.others.position" /></span>
                </div>
            </div>

            <div className="gx-module-side-content">
                <CustomScrollbars className="gx-module-side-scroll">
                    <div className="gx-module-add-task">
                        <Button className="gx-btn-block ant-btn" type="primary" aria-label="add"
                            onClick={() => onAddPosition()}>
                            <i className="icon icon-add gx-mr-2" />
                            <span>New Position</span>
                        </Button>
                    </div>
                    <div className="gx-module-side-nav">
                        <ul className="gx-module-nav">
                            {filterOptions.map(option => <li key={option.id} className="gx-nav-item">
                                <span
                                    className={`gx-link ${option.status === state.filterStatus ? 'active' : ''}`} onClick={() =>
                                        setState({ ...state, filterStatus: option.status })
                                    }>
                                    <i className={`icon icon-${option.icon}`} />
                                    <span>{option.name}</span>
                                </span>
                            </li>
                            )}
                        </ul>
                    </div>
                </CustomScrollbars>
            </div>
        </div>

    };

    const onAddPosition = (props) => {
        showModal({ show: true, myProps: props })
    }

    const onToggleDrawer = () => {
        setState({ ...state, drawerState: !state.drawerState })
    }

    //==================== ===============================
    const columns = [{
        title: 'Position Code',
        dataIndex: 'code',
        key: 'code',
    }, {
        title: 'Position Name',
        dataIndex: 'description',
        key: 'description',
    }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
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
        <div className="gx-main-content">
            <div className="gx-app-module">
                <div className="gx-d-block gx-d-lg-none">
                    <Drawer
                        placement="left"
                        closable={false}
                        visible={state.drawerState}
                        onClose={onToggleDrawer}>
                        {ContactSideBar()}
                    </Drawer>
                </div>
                <div className="gx-module-sidenav gx-d-none gx-d-lg-flex">
                    {ContactSideBar()}
                </div>

                <div className="gx-module-box">
                    <div className="gx-module-box-header">
                        <span className="gx-drawer-btn gx-d-flex gx-d-lg-none">
                            <i className="icon icon-menu gx-icon-btn" aria-label="Menu"
                                onClick={onToggleDrawer} />
                        </span>

                        <AppModuleHeader placeholder="Search Office" notification={false} apps={false}
                            onChange={(e) => setFilter(e.target.value)}
                            value={filter} />
                    </div>
                    <div className="gx-module-box-content">
                        <CustomScrollbars className="gx-module-content-scroll">
                            <Table
                                loading={loading}
                                className="gx-table-responsive"
                                columns={columns}
                                dataSource={_.get(data, "list")}
                                rowKey={record => record.id}
                                size="middle"
                            />
                        </CustomScrollbars>
                    </div>
                </div>
            </div>
            {/* modal component */}
            {modal}
        </div>
    )
}

export default Positions;
