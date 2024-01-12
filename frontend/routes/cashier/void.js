import React from "react";
import { Card, Row, Col, Table, Button, Tag, message } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { dialogHook } from "../../util/customhooks";
import moment from "moment";
import VoidOR from "./dialogs/voidOR";

//graphQL Queries
const GET_RECORDS = gql`
  {
    list: shiftPerEmp {
      id
      terminal {
        id
        terminal_no
      }
      shiftNo
      active
      startShift
      endShift
      employee {
        id
        fullName
      }
    }
  }
`;

const VoidContent = ({ account }) => {
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    fetchPolicy: "network-only",
  });

  const [modal, showModal] = dialogHook(VoidOR, (result) => {
    if (result) {
      message.success(result);
      refetch();
    }
  });
  // ===================================================//

  const columns = [
    {
      title: "Terminal #",
      key: "terminal_no",
      render: (txt, record) => <span>{record.terminal?.terminal_no}</span>,
    },
    {
      title: "Shift #",
      dataIndex: "shiftNo",
      key: "shiftNo",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Start Shift",
      dataIndex: "startShift",
      key: "startShift",
      render: (startShift) => (
        <span>
          {startShift && moment(startShift).format("MM/DD/YYYY h:mm:ss A")}
        </span>
      ),
    },
    {
      title: "End Shift",
      dataIndex: "endShift",
      key: "endShift",
      render: (endShift) => (
        <span>
          {endShift && moment(endShift).format("MM/DD/YYYY h:mm:ss A")}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (txt, record) => (
        <Button
          type="danger"
          size="small"
          onClick={() =>
            showModal({
              show: true,
              myProps: { ...record, access: account?.user?.access },
            })
          }
        >
          Void OR/SI
        </Button>
      ),
    },
  ];

  return (
    <Card title="Void Payments" size="small">
      <Row>
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
    </Card>
  );
};

export default VoidContent;
