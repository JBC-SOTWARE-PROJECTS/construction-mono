import React, { useState } from "react";
import { Table, Col, Row, Input, Tag, Statistic } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { colSearch, colButton } from "../../../shared/constant";
import _ from "lodash";
import moment from "moment";
import numeral from "numeral";

const { Search } = Input;
//graphQL Queries
const GET_RECORDS = gql`
  query ($project: UUID, $filter: String) {
    list: pettyCashListByProject(project: $project, filter: $filter) {
      code
      dateTrans
      pettyType {
        id
        description
      }
      shift {
        id
        shiftNo
      }
      remarks
      notes
      amount
      receivedBy {
        id
        fullName
      }
      receivedFrom
      lastModifiedBy
    }
  }
`;

const ProjectExpenses = ({ id }) => {
  const [filter, setFilter] = useState("");
  //query
  const { loading, data } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
      project: id,
    },
    fetchPolicy: "network-only",
  });

  const columns = [
    {
      title: "Date of Transaction",
      dataIndex: "dateTrans",
      key: "dateTrans",
      render: (text) => {
        return <span>{moment(text).format("MM-DD-YYYY h:mm a")}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Expense Type",
      dataIndex: "pettyType",
      key: "pettyType",
      render: (text, record) => {
        return <span>{record?.pettyType?.description}</span>;
      },
    },
    {
      title: "Shift",
      dataIndex: "shiftNo",
      key: "shiftNo",
      render: (text, record) => {
        return <span>{record?.shift?.shiftNo}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => {
        return <span>{numeral(amount).format("0,0.00")}</span>;
      },
    },

    {
      title: "Received By",
      dataIndex: "receivedBy",
      key: "receivedBy",
      render: (text, record) => {
        return <span>{record?.receivedBy?.fullName}</span>;
      },
    },
  ];

  return (
    <div className="pd-10">
      <Row>
        <Col {...colSearch}>
          <Search
            placeholder="Search Project Materials"
            onSearch={(e) => setFilter(e)}
            enterButton
          />
        </Col>
        <Col {...colButton}>
          <Statistic
            title="Total Expenses (Php)"
            valueStyle={{ color: "#cf1322" }}
            value={_.sumBy(_.get(data, "list"), "amount")}
            precision={2}
          />
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
    </div>
  );
};

export default ProjectExpenses;
