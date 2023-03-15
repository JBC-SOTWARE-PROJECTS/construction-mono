import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Input,
  Divider,
  Typography,
  Checkbox,
  Tag,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col4 } from "../../shared/constant";
import moment from "moment";
import numeral from "numeral";

const { Search } = Input;
const { Text } = Typography;

//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $status: Boolean, $page: Int, $size: Int) {
    list: billingByFiltersPage(
      filter: $filter
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        dateTrans
        billNo
        project {
          id
          projectCode
          description
        }
        customer {
          id
          fullName
        }
        otcName
        locked
        lockedBy
        balance
        status
      }
      size
      totalElements
      number
    }
  }
`;


const BillingContent = ({ account }) => {
  const [state, setState] = useState({
    filter: "",
    status: true,
    page: 0,
    size: 10,
  });
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      status: state.status,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "network-only",
  });

  //=============

  const columns = [
    {
      title: "Bill #",
      dataIndex: "billNo",
      key: "billNo",
      fixed: "left",
      width: 150,
      render: (billNo, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => window.open(`/billing/billingaccounts/${record.id}`)}
        >
          {billNo}
        </Button>
      ),
    },
    {
      title: "Project #",
      key: "projectCode",
      fixed: "left",
      width: 150,
      render: (txt, record) => (
        <Button
          key={txt}
          type="link"
          size="small"
          onClick={() => jobModal(record.job?.id, true)}
        >
          {record?.job?.jobNo}
        </Button>
      ),
    },

    {
      title: "Customer",
      key: "customer.fullName",
      render: (txt, record) => (
        <span key={txt}>{record?.customer?.fullName}</span>
      ),
    },

    {
      title: "Description",
      key: "job.description",
      render: (txt, record) => <span>{record?.job?.description}</span>,
    },
    {
      title: "Transaction Date",
      dataIndex: "dateTrans",
      key: "dateTrans",
      render: (dateTrans) => (
        <span>{moment(dateTrans).format("MM/DD/YYYY h:mm:ss A")}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 150,
      render: (status) => {
        let color = status ? "green" : "red";
        let text = status ? "ACTIVE" : "INACTIVE";
        return (
          <span>
            <Tag color={color} key={color}>
              {text}
            </Tag>
          </span>
        );
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      fixed: "right",
      width: 150,
      render: (bal) => {
        let style = { color: "danger" };
        if (bal <= 0) {
          style = { color: "success" };
        }
        return <Text type={style.color}>{numeral(bal).format("0,0.00")}</Text>;
      },
    },
  ];

  return (
    <Card title="Billing Accounts" size="small">
      <Row>
        <Col span={18}>
          <Search
            placeholder="Search Billing Accounts"
            onSearch={(e) => setState({ ...state, filter: e })}
            enterButton
          />
        </Col>
        <Col {...col4}>
          <Checkbox
            checked={state.status}
            onChange={(e) => {
              setState({ ...state, status: e?.target?.checked });
            }}
            style={{ marginTop: 5 }}
          >
            Show only active billing
          </Checkbox>
        </Col>
        <Col span={24}>
          <Divider />
          <Table
            loading={loading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={_.get(data, "list.content", [])}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: _.get(data, "list.size", 0),
              total: _.get(data, "list.totalElements", 0),
              defaultCurrent: _.get(data, "list.number", 0) + 1,
              onChange: (page) => {
                setState({ ...state, page: page - 1 });
              },
            }}
            scroll={{
              x: 2000,
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default BillingContent;
