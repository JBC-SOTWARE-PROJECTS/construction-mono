import React, { useState } from "react";
import {
  Table,
  Col,
  Row,
  Input,
  Typography,
  Tag,
  DatePicker,
  Statistic,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import _ from "lodash";
import moment from "moment";
import numeral from "numeral";
import { col4 } from "../../../shared/constant";

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $id: UUID, $start: String, $end: String) {
    list: jobOrderByAssetList(
      filter: $filter
      id: $id
      start: $start
      end: $end
    ) {
      id
      dateTrans
      code
      description
      project {
        id
        description
      }
      totals
      status
    }
  }
`;

const AssetJobOrders = ({ id }) => {
  const [filter, setFilter] = useState("");
  const [state, setState] = useState({
    start: moment(new Date()).startOf("month").format("YYYY-MM-DD"),
    end: moment(new Date()).endOf("month").format("YYYY-MM-DD"),
  });
  //query
  const { loading, data } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
      id: id,
      start: state.start + "T00:00:00Z",
      end: state.end + "T23:00:00Z",
    },
    fetchPolicy: "network-only",
  });

  const onChangeDate = (date2, dateString) => {
    setState({
      ...state,
      start: dateString[0],
      end: dateString[1],
    });
  };

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
      dataIndex: "description",
      key: "description",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      render: (text, record) => {
        return <span>{record.project?.description}</span>;
      },
    },
    {
      title: "Total Cost",
      dataIndex: "totals",
      key: "totals",
      render: (cost) => {
        return <Text type="success">{numeral(cost).format("0,0.00")}</Text>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let color = "blue";
        if (record.status === "COMPLETED") {
          color = "green";
        } else if (record.status === "CANCELLED") {
          color = "red";
        } else if (record.status === "PENDING") {
          color = "magenta";
        }
        return (
          <span>
            <Tag color={color} key={color}>
              {status}
            </Tag>
            {record?.billed && (
              <Tag color="cyan" key="cyan">
                Billed
              </Tag>
            )}
          </span>
        );
      },
    },
  ];

  return (
    <div className="pd-10">
      <Row>
        <Col span={12}>
          <Search
            placeholder="Search Job Order"
            onSearch={(e) => setFilter(e)}
            enterButton
          />
        </Col>
        <Col {...col4}>
          <RangePicker
            defaultValue={[
              moment(state.start, dateFormat),
              moment(state.end, dateFormat),
            ]}
            format={dateFormat}
            onChange={onChangeDate}
            style={{ width: "100%" }}
          />
        </Col>
        <Col {...col4}>
          <Statistic
            title="Total Income (Php)"
            valueStyle={{ color: "#52c41a" }}
            value={_.sumBy(_.get(data, "list", []), "totals")}
            precision={2}
          />
        </Col>
        <Col span={24}>
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
    </div>
  );
};

export default AssetJobOrders;
