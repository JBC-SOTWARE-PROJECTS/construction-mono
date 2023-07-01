import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Divider,
  DatePicker,
  Input,
  Button,
  message,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2 } from "../../../shared/constant";
import { get } from "../../../shared/global";
import { CloudDownloadOutlined } from "@ant-design/icons";
import numeral from "numeral";
import moment from "moment";

//graphQL Queries
const SRR_REPORT_LIST = gql`
  query ($start: Instant, $end: Instant, $filter: String) {
    getSrrByDateRange(start: $start, end: $end, filter: $filter) {
      id
      receivedType
      rrNo
      receiveDate
      userFullname
      receivedOffice {
        id
        officeDescription
      }
      purchaseOrder {
        id
        poNumber
      }
      supplier {
        id
        supplierFullname
      }
      receivedRefNo
      receivedRefDate
      paymentTerms {
        id
        paymentDesc
      }
      receivedRemarks
      fixDiscount
      grossAmount
      totalDiscount
      netDiscount
      amount
      vatRate
      inputTax
      netAmount
      vatInclusive
      isPosted
      isVoid
      account
    }
  }
`;

const { RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = "YYYY-MM-DD";

const DReportContent = ({ account }) => {
  const [filter, setFilter] = useState("");
  const [state, setState] = useState({
    start: moment(new Date()).format("YYYY-MM-DD"),
    end: moment(new Date()).format("YYYY-MM-DD"),
    loading: false,
  });
  //query
  const { loading: srrLoading, data: srrData } = useQuery(SRR_REPORT_LIST, {
    variables: {
      start: state.start + "T00:00:00Z",
      end: state.end + "T23:00:00Z",
      filter: filter,
    },
    fetchPolicy: "network-only",
  });

  const onChange = (date2, dateString) => {
    setState({
      ...state,
      start: dateString[0],
      end: dateString[1],
    });
  };

  const downloadCsv = () => {
    setState({ ...state, loading: true });
    get(`/api/srr/report`, {
      params: {
        start: state.start + "T00:00:00Z",
        end: state.end + "T23:00:00Z",
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `dr-summary-report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setState({ ...state, loading: false });
      })
      .catch((error) => {
        console.log(error);
        message.error(`Error generating report: ${error?.message}`);
      });
  };

  const columns = [
    {
      title: "SRR #",
      dataIndex: "rrNo",
      key: "rrNo",
    },
    {
      title: "Receiving Date",
      dataIndex: "receiveDate",
      key: "receiveDate",
      render: (receiveDate, record) => (
        <span key={receiveDate}>
          {moment(receiveDate).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "PO Number",
      dataIndex: "purchaseOrder.poNumber",
      key: "purchaseOrder.poNumber",
      render: (text, record) => <span>{record.purchaseOrder?.poNumber}</span>,
    },
    {
      title: "Office Name",
      dataIndex: "receivedOffice.officeName",
      key: "receivedOffice.officeName",
      render: (text, record) => (
        <span>{record.receivedOffice?.officeDescription}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (text, record) => (
        <span>{record.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount) => <span>{numeral(amount).format("0,0.00")}</span>,
    },
  ];

  return (
    <Card
      title="Delivery Receiving Report Sumarry"
      size="small"
      extra={
        <span>
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
            placeholder="Search Items"
            onSearch={(e) => setFilter(e)}
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
          <Divider />
          <Table
            loading={srrLoading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={_.get(srrData, "getSrrByDateRange", [])}
            rowKey={(row) => row.id}
            size={"small"}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default DReportContent;
