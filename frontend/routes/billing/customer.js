import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Dropdown,
  Menu,
  Button,
  Input,
  message,
  Divider,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from "@ant-design/icons";
import { dialogHook } from "../../util/customhooks";
import CustomerForm from "./dialogs/customerForm";

const { Search } = Input;
const options = ["Edit"];

//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String) {
    list: customerList(filter: $filter) {
      id
      fullName
      customerType
      address
      telNo
      emailAdd
      contactPerson
      contactPersonNum
    }
  }
`;

const CustomerContent = ({ account }) => {
  const [state, setState] = useState({
    filter: "",
  });
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
    },
    fetchPolicy: "network-only",
  });

  const [modal, showModal] = dialogHook(CustomerForm, (result) => {
    // item form
    if (result) {
      message.success(result);
      refetch();
    }
  });

  //======================= =================== =================================================//
  const menus = (record) => (
    <Menu
      onClick={(e) => {
        if (e.key === "Edit") {
          showModal({ show: true, myProps: record });
        }
      }}
    >
      {options.map((option) => (
        <Menu.Item key={option}>{option}</Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: "Fullname",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Contact #",
      dataIndex: "telNo",
      key: "telNo",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span>
          <Dropdown
            overlay={menus(record)}
            placement="bottomRight"
            trigger={["click"]}
          >
            <i className="gx-icon-btn icon icon-ellipse-v" />
          </Dropdown>
        </span>
      ),
    },
  ];

  return (
    <Card
      title="Customer List"
      size="small"
      extra={
        <Button
          size="small"
          type="primary"
          icon={<PlusCircleOutlined />}
          className="margin-0"
          onClick={() => showModal({ show: true, myProps: null })}
        >
          Add New Customer
        </Button>
      }
    >
      <Row>
        <Col span={24}>
          <Search
            placeholder="Search Customer"
            onSearch={(e) => setState({ ...state, filter: e })}
            enterButton
          />
        </Col>
        <Col span={24}>
          <Divider />
          <Table
            loading={loading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={_.get(data, "list", [])}
            rowKey={(record) => record.id}
            size="small"
          />
        </Col>
      </Row>
      {modal}
    </Card>
  );
};

export default CustomerContent;
