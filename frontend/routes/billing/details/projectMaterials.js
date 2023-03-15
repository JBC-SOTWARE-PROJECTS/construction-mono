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
  Statistic,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { colSearch, colButton } from "../../../shared/constant";
import _ from "lodash";
import moment from "moment";
import numeral from "numeral";

const { Search } = Input;
const { Text } = Typography;
//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $id: UUID) {
    list: pMaterialByList(filter: $filter, id: $id) {
      id
      dateTransact
      refNo
      item {
        id
        itemCode
        descLong
        brand
        item_group {
          id
          itemDescription
        }
        item_category {
          id
          categoryDescription
        }
      }
      qty
      cost
      subTotal
      lastModifiedBy
    }
  }
`;

const ProjectMaterials = ({ id }) => {
  const [filter, setFilter] = useState("");
  //query
  const { loading, data } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
      id: id,
    },
    fetchPolicy: "network-only",
  });

  const columns = [
    {
      title: "Date of Transaction",
      dataIndex: "dateTransact",
      key: "dateTransact",
      render: (text, record) => {
        return <span>{moment(text).format("MM-DD-YYYY h:mm a")}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => {
        return <span>{record.item?.descLong}</span>;
      },
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      render: (qty) => {
        return <span>{numeral(qty).format("0,0")}</span>;
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => {
        return <span>{numeral(cost).format("0,0.00")}</span>;
      },
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      render: (subTotal) => {
        return <span>{numeral(subTotal).format("0,0.00")}</span>;
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
            title="Total Materials (Php)"
            valueStyle={{ color: "#cf1322" }}
            value={_.sumBy(_.get(data, "list"), "subTotal")}
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

export default ProjectMaterials;
