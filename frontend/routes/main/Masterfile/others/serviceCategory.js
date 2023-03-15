import React, { useState } from "react";
import {
  Table,
  Col,
  Row,
  Tag,
  Dropdown,
  Menu,
  Input,
  message,
  Button,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from "@ant-design/icons";
import { dialogHook } from "../../../../util/customhooks";
import _ from "lodash";
import { colSearch, colButton } from "../../../../shared/constant";
import ServiceCategoryForm from "../dialogs/serviceCategoryForm";

const { Search } = Input;

const options = ["Edit"];

//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String) {
    list: serviceCategoryList(filter: $filter) {
      id
      code
      description
      is_active
    }
  }
`;

const ServiceCategory = ({ account }) => {
  const [filter, setFilter] = useState("");
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
    },
  });

  const [modal, showModal] = dialogHook(ServiceCategoryForm, (result) => {
    if (result) {
      message.success(result);
      refetch();
    }
  });
  // ===================================================//

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
      title: "Service Category Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Service Category",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (status) => (
        <span>
          <Tag color={status === true ? "green" : "red"} key={status}>
            {status === true ? "Active" : "Inactive"}
          </Tag>
        </span>
      ),
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
    <div className="pd-10">
      <Row>
        <Col {...colSearch}>
          <Search
            placeholder="Search Service Category"
            onSearch={(e) => setFilter(e)}
            enterButton
          />
        </Col>
        <Col {...colButton}>
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            block
            onClick={() => showModal({ show: true, myProps: null })}
          >
            New
          </Button>
        </Col>
        <Col span={24}>
          <Table
            loading={loading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={_.get(data, "list")}
            rowKey={(record) => record.id}
            size="small"
          />
        </Col>
      </Row>
      {/* modal component */}
      {modal}
    </div>
  );
};

export default ServiceCategory;
