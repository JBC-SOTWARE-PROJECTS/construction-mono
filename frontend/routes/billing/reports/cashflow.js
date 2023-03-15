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
  DatePicker,
  message,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PrinterOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { col2, col4 } from "../../../shared/constant";
import IconWithTextCard from "../../../app/components/dashboard/CRM/IconWithTextCard";
import { getUrlPrefix, get } from "../../../shared/global";
import moment from "moment";
import numeral from "numeral";

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Title } = Typography;

//graphQL Queries
const QUERY = gql`
  query ($start: String, $end: String, $filter: String) {
    list: cashFlowReport(start: $start, end: $end, filter: $filter) {
      id
      date
      refNo
      type
      description
      amount
    }
    revenue: totalRevenue(start: $start, end: $end)
    cashIn: totalCashIn(start: $start, end: $end)
    expense: totalExpense(start: $start, end: $end)
    cashBalance: totalCashBalance(start: $start, end: $end)
  }
`;

const CashFlowContent = ({ account }) => {
  const dateFormat = "YYYY-MM-DD";
  const [state, setState] = useState({
    loading: false,
    start: moment().startOf("month").format("YYYY-MM-DD"),
    end: moment().endOf("month").format("YYYY-MM-DD"),
    filter: "",
  });
  //query
  const { loading, data, refetch } = useQuery(QUERY, {
    variables: {
      start: state.start,
      end: state.end,
      filter: state.filter,
    },
    fetchPolicy: "network-only",
  });

  //======================= =================== =================================================//
  const onChange = (date2, dateString) => {
    setState({
      ...state,
      start: dateString[0],
      end: dateString[1],
    });
    console.log("moment", date2);
  };

  const print = () => {
    window.open(
      `${getUrlPrefix()}/reports/billing/print/cashflow/${state.start}/${
        state.end
      }`
    );
  };

  const downloadCsv = () => {
    setState({ ...state, loading: true });
    get(`/reports/billing/print/cashflow_download`, {
      params: {
        start: state.start,
        end: state.end,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `cashflow-report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setState({ ...state, loading: false });
      })
      .catch((err) => {
        message.error({
          title: "Error generating report",
          content: err.message,
        });
        setState({ ...state, loading: false });
      });
  };

  const columns = [
    {
      title: "Reference #",
      key: "refNo",
      dataIndex: "refNo",
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (trans_date) => (
        <span>{trans_date && moment(trans_date).format("MM/DD/YYYY")}</span>
      ),
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
      render: (amount) => <span>{numeral(amount).format("0,0.00")}</span>,
    },
  ];

  return (
    <Card
      title="Cash Flow Report"
      size="small"
      extra={
        <span>
          <Button
            size="small"
            type="primary"
            icon={<PrinterOutlined />}
            className="margin-0"
            onClick={print}
          >
            Print
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<CloudDownloadOutlined />}
            className="margin-0"
            onClick={downloadCsv}
            loading={state.loading}
          >
            Download CSV
          </Button>
        </span>
      }
    >
      <Row>
        <Col {...col2}>
          <Search
            placeholder="Search"
            onSearch={(e) => setState({ ...state, filter: e })}
            enterButton
          />
        </Col>
        <Col {...col2}>
          <RangePicker
            defaultValue={[
              moment(state.start, dateFormat),
              moment(state.end, dateFormat),
            ]}
            format={dateFormat}
            onChange={onChange}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={24}>
          <Row>
            <Col {...col4}>
              <IconWithTextCard
                cardColor="cyan"
                icon="diamond"
                title={numeral(_.get(data, "revenue", 0)).format("0,0.00")}
                subTitle="Total Revenue"
              />
            </Col>
            <Col {...col4}>
              <IconWithTextCard
                cardColor="info"
                icon="diamond"
                title={numeral(_.get(data, "cashIn", 0)).format("0,0.00")}
                subTitle="Total Cash In Transaction"
              />
            </Col>
            <Col {...col4}>
              <IconWithTextCard
                cardColor="orange"
                icon="diamond"
                title={numeral(_.get(data, "expense", 0)).format("0,0.00")}
                subTitle="Total Expenses/Cash Out"
              />
            </Col>
            <Col {...col4}>
              <IconWithTextCard
                cardColor="teal"
                icon="diamond"
                title={numeral(_.get(data, "cashBalance", 0)).format("0,0.00")}
                subTitle="Cash Balance"
              />
            </Col>
          </Row>
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
    </Card>
  );
};

export default CashFlowContent;
