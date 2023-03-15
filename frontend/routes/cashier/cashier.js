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
  Statistic,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { MoneyCollectOutlined } from "@ant-design/icons";
import { col4 } from "../../shared/constant";
import moment from "moment";
import numeral from "numeral";
import { dialogHook } from "../../util/customhooks";
import AddPaymentForm from "./dialogs/addPayments";
import _ from "lodash";

const { Search } = Input;
const { Text } = Typography;

//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $status: Boolean, $page: Int, $size: Int) {
    list: billingAllByFiltersPage(
      filter: $filter
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        dateTrans
        billNo
        customer {
          id
          fullName
        }
        job {
          id
          jobNo
          plateNo
          description
          insurance {
            id
            description
          }
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
    balance: totalBalances
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

  const [modal, showModal] = dialogHook(AddPaymentForm, () => {
    refetch();
  });
  //======================= =================== =================================================//

  const columns = [
    {
      title: "Bill #",
      dataIndex: "billNo",
      key: "billNo",
      fixed: "left",
      width: 150,
      render: (billNo, record) => (
        <>
          {_.isEmpty(record?.customer) ? (
            <Button
              type="link"
              size="small"
              onClick={() => window.open(`/billing/otc/${record.id}`)}
            >
              {billNo}
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              onClick={() =>
                window.open(`/billing/billingaccounts/${record.id}`)
              }
            >
              {billNo}
            </Button>
          )}
        </>
      ),
    },
    {
      title: "Plate #",
      key: "job.plateNo",
      render: (txt, record) => <span key={txt}>{record?.job?.plateNo}</span>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => (
        <span>
          {_.isEmpty(record?.customer)
            ? record?.otcName
            : record?.customer?.fullName}
        </span>
      ),
    },
    {
      title: "Insurance",
      key: "job.insurance",
      render: (txt, record) => (
        <span key={txt}>{record?.job?.insurance?.description}</span>
      ),
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
    {
      title: "#",
      key: "action",
      fixed: "right",
      width: 250,
      render: (txt, record) => (
        <Button
          type="primary"
          icon={<MoneyCollectOutlined />}
          onClick={() => showModal({ show: true, myProps: record })}
        >
          Receive Payments
        </Button>
      ),
    },
  ];

  return (
    <Card title="Cashier Accounts Folios" size="small">
      <Row>
        <Col span={12}>
          <Search
            placeholder="Search Accounts"
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
            Show only active folio
          </Checkbox>
        </Col>
        <Col {...col4}>
          <Statistic
            title="Total Balances (Php)"
            valueStyle={{ color: "#cf1322" }}
            value={_.get(data, "balance")}
            precision={2}
          />
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
              x: 1800,
            }}
          />
        </Col>
      </Row>
      {modal}
    </Card>
  );
};

export default BillingContent;
