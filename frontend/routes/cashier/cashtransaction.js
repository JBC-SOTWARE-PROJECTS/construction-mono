import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Input,
  Divider,
  Menu,
  Dropdown,
  message,
  Typography,
  Tag,
  Modal,
  Alert,
  Statistic,
} from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { dialogHook } from "../../util/customhooks";
import PettyCashForm from "./dialogs/pettyCashForm";
import { getUrlPrefix } from "../../shared/global";
import numeral from "numeral";
import moment from "moment";
import _ from "lodash";
import { col4 } from "../../shared/constant";
import FilterSelect from "../../util/customForms/filterSelect";

//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $shift: UUID, $cashType: String) {
    list: pettyCashList(filter: $filter, shift: $shift, cashType: $cashType) {
      id
      code
      dateTrans
      pettyType {
        id
        description
      }
      receivedBy {
        id
        fullName
      }
      shift {
        id
        shiftNo
      }
      cashType
      remarks
      notes
      receivedFrom
      amount
      isPosted
      isVoid
    }
  }
`;

const GET_DATA = gql`
  {
    shift: activeShift {
      id
      terminal {
        id
        terminal_no
      }
      shiftNo
    }
    shiftList {
      value: id
      label: shiftNo
    }
  }
`;

const { confirm } = Modal;
const { Search } = Input;
const { Text } = Typography;
const options = ["Edit", "Post", "Void", "Print"];

const UPSERT_RECORD = gql`
  mutation ($status: Boolean, $id: UUID) {
    upsert: pettyCashPostVoid(status: $status, id: $id) {
      id
    }
  }
`;

const CashTransactionContent = ({ account }) => {
  const [filter, setFilter] = useState("");
  const [shift, setShift] = useState(null);
  const [cashType, setCashType] = useState(null);
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter,
      shift: shift,
      cashType: cashType,
    },
    fetchPolicy: "network-only",
  });

  const { loading: listLoading, data: listData } = useQuery(GET_DATA, {
    fetchPolicy: "network-only",
    onCompleted: (record) => {
      const { shift } = record;
      if (shift?.id) {
        setShift(shift.id);
      }
    },
  });

  const [modal, showModal] = dialogHook(PettyCashForm, (result) => {
    if (result) {
      message.success(result);
      refetch();
    }
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          message.success("Cash Transaction Updated");
          refetch();
        }
      },
    }
  );
  // ===================================================//
  const _approve = (id, status, message) => {
    confirm({
      title: `Do you want ${message} this Cash Transaction?`,
      icon: <ExclamationCircleOutlined />,
      content: "Please click ok to proceed.",
      onOk() {
        upsertRecord({
          variables: {
            status: status,
            id: id,
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const disabledMenu = (option, record) => {
    let result = false;
    if (option === "Void") {
      result = !record?.isPosted;
    } else if (option === "Post") {
      result = record?.isPosted || record?.isVoid;
    } else if (option === "Print") {
      result = record?.cashType === "CASH_IN" || record?.isVoid;
    }
    return result;
  };

  const menus = (record) => (
    <Menu
      onClick={(e) => {
        if (e.key === "Edit") {
          showModal({ show: true, myProps: record });
        } else if (e.key === "Post") {
          _approve(record?.id, true, "post");
        } else if (e.key === "Void") {
          _approve(record?.id, false, "void");
        } else if (e.key === "Print") {
          window.open(
            `${getUrlPrefix()}/reports/billing/print/pettycash/${record.id}`
          );
        }
      }}
    >
      {options.map((option) => (
        <Menu.Item key={option} disabled={disabledMenu(option, record)}>
          {option}
        </Menu.Item>
      ))}
    </Menu>
  );

  const renderExpandableRow = (record) => {
    return (
      <div className="w-full">
        <p>Remarks/Notes:</p>
        <pre className="pl-20">{record.notes}</pre>
      </div>
    );
  };

  const columns = [
    {
      title: "Transaction #",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Date",
      dataIndex: "dateTrans",
      key: "dateTrans",
      render: (dateTrans) => (
        <span>{dateTrans && moment(dateTrans).format("MM/DD/YYYY")}</span>
      ),
    },
    {
      title: "Shift No",
      dataIndex: "shiftNo",
      key: "shiftNo",
      render: (text, record) => <span>{record.shift?.shiftNo}</span>,
    },
    {
      title: "Cash Type",
      dataIndex: "cashType",
      key: "cashType",
      render: (txt) => {
        let obj = { color: "red", text: "CASH OUT" };
        if (txt === "CASH_IN") {
          obj = { color: "blue", text: "CASH IN" };
        }
        return <Tag color={obj.color}>{obj.text}</Tag>;
      },
    },
    {
      title: "Type",
      dataIndex: "pettyType",
      key: "pettyType",
      render: (txt, record) => <span>{record.pettyType?.description}</span>,
    },
    {
      title: "Description",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => {
        let color = "danger";
        if (record.cashType === "CASH_IN") {
          color = "success";
        }
        return <Text type={color}>{numeral(amount).format("0,0.00")}</Text>;
      },
    },
    {
      title: "Status",
      dataIndex: "isPosted",
      key: "isPosted",
      render: (status, record) => {
        let color = status === true ? "green" : "blue";
        let text = status === true ? "POSTED" : "NEW";
        if (record.isVoid) {
          color = "red";
          text = "VOIDED";
        }
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
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span key={text}>
          <Dropdown
            overlay={menus(record)}
            placement="bottomRight"
            trigger={["click"]}
          >
            <i className="gx-icon-btn icon icon-ellipse-v" />
          </Dropdown>
        </span>
      ),
    },
  ];

  return (
    <Card
      title="Cash Transaction"
      size="small"
      extra={
        <>
          <Button
            size="small"
            type="primary"
            icon={<PlusCircleOutlined />}
            className="margin-0"
            onClick={() =>
              showModal({
                show: true,
                myProps: {
                  cashType: "CASH_IN",
                  shift: _.get(listData, "shift.id"),
                  title: "CASH IN TRANSACTION",
                },
              })
            }
            disabled={
              _.indexOf(account?.user?.access, "create_petty_cash") <= -1 ||
              _.isEmpty(_.get(listData, "shift.id"))
            }
          >
            Add New Cash In Transaction
          </Button>
          <Button
            size="small"
            type="danger"
            icon={<PlusCircleOutlined />}
            className="margin-0"
            onClick={() =>
              showModal({
                show: true,
                myProps: {
                  cashType: "CASH_OUT",
                  shift: _.get(listData, "shift.id"),
                  title: "CASH OUT TRANSACTION",
                },
              })
            }
            disabled={
              _.indexOf(account?.user?.access, "create_petty_cash") <= -1 ||
              _.isEmpty(_.get(listData, "shift.id"))
            }
          >
            Add New Cash Out Transaction
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<PrinterOutlined />}
            className="margin-0"
            onClick={() => console.log("print")}
            disabled={_.isEmpty(_.get(data, "list"))}
          >
            Print Cash Transaction
          </Button>
        </>
      }
    >
      <Row>
        {_.get(listData, "shift.id") ? (
          <Col span={24}>
            <Alert
              message={`Current Active Shift: ${_.get(
                listData,
                "shift.shiftNo"
              )}`}
              description="All cash transaction will be recorded under this shift"
              type="info"
              showIcon
            />
          </Col>
        ) : (
          <Col span={24}>
            <Alert
              message="Error"
              description="No Active Shift Found. Start Shift to Procceed"
              type="error"
              showIcon
            />
          </Col>
        )}
        <Col span={12}>
          <Search
            placeholder="Search Cash Transaction"
            onSearch={(e) => setFilter(e)}
            enterButton
          />
        </Col>
        <Col {...col4}>
          <FilterSelect
            allowClear
            field="type"
            placeholder="Filter By Cash Type"
            defaultValue={null}
            onChange={(e) => {
              setCashType(e);
            }}
            list={[
              { label: "CASH IN", value: "CASH_IN" },
              { label: "CASH OUT", value: "CASH_OUT" },
            ]}
          />
        </Col>
        <Col {...col4}>
          {!listLoading && (
            <FilterSelect
              allowClear
              loading={listLoading}
              field="shifts"
              placeholder="Filter By Shift"
              defaultValue={_.get(listData, "shift.id")}
              onChange={(e) => {
                setShift(e ? e : null);
              }}
              list={_.get(listData, "shiftList")}
            />
          )}
        </Col>
        <Col span={12}>
          <Statistic
            title="Total Cash In (Php)"
            valueStyle={{ color: "#3f8600" }}
            value={_.sumBy(_.get(data, "list"), function (o) {
              if (o.cashType === "CASH_IN" && o.isPosted) {
                return o.amount;
              }
            })}
            precision={2}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Total Cash Out (Php)"
            valueStyle={{ color: "#cf1322" }}
            value={_.sumBy(_.get(data, "list"), function (o) {
              if (o.cashType === "CASH_OUT" && o.isPosted) {
                return o.amount;
              }
            })}
            precision={2}
          />
        </Col>
        <Col span={24}>
          <Divider />
          <Table
            loading={loading || upsertLoading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={_.get(data, "list")}
            rowKey={(record) => record.id}
            expandedRowRender={(record) => renderExpandableRow(record)}
            size="small"
          />
        </Col>
      </Row>
      {modal}
    </Card>
  );
};

export default CashTransactionContent;
