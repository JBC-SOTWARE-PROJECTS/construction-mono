import React, { useState } from "react";
import {
  Table,
  Col,
  Row,
  Input,
  message,
  Button,
  Typography,
  Tag,
  Modal,
} from "antd";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  PlusCircleOutlined,
} from "@ant-design/icons";
import { colSearch, colButton } from "../../../shared/constant";
import _ from "lodash";
import moment from "moment";
import { dialogHook } from "../../../util/customhooks";
import AddProjectUpdatesForm from "../dialogs/addProjectUpdates";

const { Search } = Input;
const { Text } = Typography;
//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $id: UUID) {
    list: pUpdatesByList(filter: $filter, id: $id) {
      id
      dateTransact
      description
      status
      lastModifiedBy
    }
  }
`;

const ProjectUpdates = ({ id }) => {
  const [filter, setFilter] = useState("");
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
      id: id,
    },
    fetchPolicy: "network-only",
  });

  const [modal, showModal] = dialogHook(AddProjectUpdatesForm, (result) => {
    if (result) {
      message.success(result);
    }
    refetch();
  });

  const columns = [
    {
      title: "Date of Transaction",
      dataIndex: "dateTransact",
      key: "dateTransact",
      render: (text, record) => {
        if (record.status) {
          return <span>{moment(text).format("MM-DD-YYYY h:mm a")}</span>;
        } else {
          return (
            <Text delete type="danger">
              {moment(text).format("MM-DD-YYYY h:mm a")}
            </Text>
          );
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "60%",
      render: (text, record) => {
        if (record.status) {
          return <span>{text}</span>;
        } else {
          return (
            <Text delete type="danger">
              {text}
            </Text>
          );
        }
      },
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        if (record.status) {
          return <Tag color="blue">{status}</Tag>;
        } else {
          return (
            <Text delete>
              <Tag>{cost}</Tag>
            </Text>
          );
        }
      },
    },
    {
      title: "User",
      dataIndex: "lastModifiedBy",
      key: "lastModifiedBy",
      render: (lastModifiedBy) => {
        return <Tag color="magenta">{lastModifiedBy}</Tag>;
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => showModal({ show: true, myProps: { ...record, project: id } })}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="pd-10">
      <Row>
        <Col {...colSearch}>
          <Search
            placeholder="Search Project Updates"
            onSearch={(e) => setFilter(e)}
            enterButton
          />
        </Col>
        <Col {...colButton}>
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            block
            onClick={() => showModal({ show: true, myProps: { project: id } })}
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
      {modal}
    </div>
  );
};

export default ProjectUpdates;
