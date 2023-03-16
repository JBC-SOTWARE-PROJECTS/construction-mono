import React, { useState } from "react";
import {
  Table,
  Col,
  Row,
  Input,
  message,
  Button,
  Typography,
  Modal,
} from "antd";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  ExclamationCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { colSearch, colButton } from "../../../shared/constant";
import _ from "lodash";
import moment from "moment";
import numeral from "numeral";
import { dialogHook } from "../../../util/customhooks";
import AddProjectCostForm from "../dialogs/addCostProject";

const { Search } = Input;
const { Text } = Typography;
//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $id: UUID) {
    list: pCostByList(filter: $filter, id: $id) {
      id
      dateTransact
      description
      refNo
      unit
      totalCost
      category
      cost
      qty
      status
      lastModifiedBy
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($id: UUID) {
    upsert: updateStatusCost(id: $id) {
      id
    }
  }
`;

const ProjectCost = ({ id, parentRef = () => {} }) => {
  const [filter, setFilter] = useState("");
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
      id: id,
    },
    fetchPolicy: "network-only",
  });

  const [modal, showModal] = dialogHook(AddProjectCostForm, (result) => {
    if (result) {
      message.success(result);
    }
    refetch();
    parentRef();
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          message.success("Project Cost successfully canceled.");
          refetch();
          parentRef();
        }
      },
    }
  );

  const confirm = (record) => {
    Modal.confirm({
      title: "Are you sure you cancel this project cost?",
      content: "Please click ok to continue",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        onCancel(record);
      },
      onCancel() {},
    });
  };

  // ===================================================//

  const onCancel = (record) => {
    if (!_.isEmpty(record)) {
      upsertRecord({
        variables: {
          id: record?.id,
        },
      });
    }
  };

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
      width: "30%",
      key: "description",
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
      title: "Qty/Unit",
      dataIndex: "qty",
      key: "qty",
      render: (qty, record) => {
        if (record.status) {
          return (
            <span>{`${numeral(qty).format("0,0.00")} [${record.unit}]`}</span>
          );
        } else {
          return (
            <Text delete type="danger">
              {`${numeral(qty).format("0,0.00")} [${record.unit}]`}
            </Text>
          );
        }
      },
    },
    {
      title: "Unit Price",
      dataIndex: "cost",
      key: "cost",
      render: (cost, record) => {
        if (record.status) {
          return <span>{numeral(cost).format("0,0.00")}</span>;
        } else {
          return (
            <Text delete type="danger">
              {numeral(cost).format("0,0.00")}
            </Text>
          );
        }
      },
    },
    {
      title: "Total",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (totalCost, record) => {
        if (record.status) {
          return <span>{numeral(totalCost).format("0,0.00")}</span>;
        } else {
          return (
            <Text delete type="danger">
              {numeral(totalCost).format("0,0.00")}
            </Text>
          );
        }
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button
          type="danger"
          size="small"
          onClick={() => confirm(record)}
          disabled={!record.status}
        >
          Cancel
        </Button>
      ),
    },
  ];

  return (
    <div className="pd-10">
      <Row>
        <Col {...colSearch}>
          <Search
            placeholder="Search Project Costs"
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
            loading={loading || upsertLoading}
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

export default ProjectCost;
