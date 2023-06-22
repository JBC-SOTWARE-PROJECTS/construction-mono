import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Dropdown,
  Menu,
  Button,
  Input,
  message,
  Divider,
  Modal,
  DatePicker,
} from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { dialogHook } from "../../../util/customhooks";
import { col4, col2 } from "../../../shared/constant";
import FilterSelect from "../../../util/customForms/filterSelect";
import PRForm from "./dialogs/prForm";
import { getUrlPrefix } from "../../../shared/global";
import moment from "moment";

const { Search } = Input;
const { confirm } = Modal;
const options = ["Edit", "Approve", "Void", "Print"];
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
//graphQL Queries
const GET_RECORDS = gql`
  query (
    $filter: String
    $office: UUID
    $start: String
    $end: String
    $page: Int
    $size: Int
  ) {
    list: prByFiltersPage(
      filter: $filter
      office: $office
      start: $start
      end: $end
      page: $page
      size: $size
    ) {
      content {
        id
        prNo
        prDateRequested
        prDateNeeded
        supplier {
          id
          supplierFullname
        }
        requestingOffice {
          id
          officeDescription
        }
        requestedOffice {
          id
          officeDescription
        }
        prType
        isApprove
        status
        userId
        userFullname
        project {
          id
          description
        }
        remarks
      }
      size
      totalElements
      number
    }
    offices: activeOffices {
      value: id
      label: officeDescription
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($status: Boolean, $id: UUID) {
    upsert: updatePRStatus(status: $status, id: $id) {
      id
    }
  }
`;

const PRContent = ({ account }) => {
  const [office, setOffice] = useState(account?.office?.id);
  const [state, setState] = useState({
    start: moment(new Date()).format("YYYY-MM-DD"),
    end: moment(new Date()).format("YYYY-MM-DD"),
    filter: "",
    page: 0,
    size: 20,
  });
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      office: office,
      start: state.start + "T00:00:00Z",
      end: state.end + "T23:00:00Z",
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "network-only",
  });

  const [modal, showModal] = dialogHook(PRForm, (result) => {
    // item form
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
          message.success("Purchase Request Information Updated");
          refetch();
        }
      },
    }
  );

  //======================= =================== =================================================//
  const _approve = (id, status, message) => {
    confirm({
      title: `Do you want ${message} this Purchase Request?`,
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
      if (_.indexOf(account?.user?.access, "pr_approver") > -1) {
        result = !record?.isApprove;
      } else {
        result = true;
      }
    } else if (option === "Approve") {
      if (_.indexOf(account?.user?.access, "pr_approver") > -1) {
        result = record?.isApprove;
      } else {
        result = true;
      }
    }
    return result;
  };

  const menus = (record) => (
    <Menu
      onClick={(e) => {
        if (e.key === "Edit") {
          showModal({ show: true, myProps: record });
        } else if (e.key === "Approve") {
          _approve(record?.id, true, "aprrove");
        } else if (e.key === "Void") {
          _approve(record?.id, false, "void");
        } else if (e.key === "Print") {
          window.open(
            `${getUrlPrefix()}/reports/inventory/print/pr_report/${record.id}`
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

  const onChangeDate = (date2, dateString) => {
    setState({
      ...state,
      start: dateString[0],
      end: dateString[1],
    });
  };

  const columns = [
    {
      title: "Request Date",
      dataIndex: "prDateRequested",
      key: "prDateRequested",
      render: (text, record) => (
        <span>{moment(record?.prDateRequested).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      title: "PR #",
      dataIndex: "prNo",
      key: "prNo",
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier",
      render: (text, record) => (
        <span>{record?.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "prType",
      key: "prType",
      render: (prType) => {
        let color = "green";
        if (prType === "URGENT") {
          color = "orange";
        } else if (prType === "EMERGENCY") {
          color = "red";
        }
        return (
          <span>
            <Tag color={color} key={prType}>
              {prType}
            </Tag>
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isApprove",
      key: "isApprove",
      render: (status, record) => (
        <span>
          <Tag color={status === true ? "green" : "orange"} key={status}>
            {record?.status}
          </Tag>
        </span>
      ),
    },

    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span>
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
      title="Purchase Request List"
      size="small"
      extra={
        <span>
          <Button
            size="small"
            type="primary"
            icon={<PlusCircleOutlined />}
            className="margin-0"
            onClick={() => showModal({ show: true, myProps: null })}
          >
            New Purchase Request
          </Button>
        </span>
      }
    >
      <Row>
        <Col {...col2}>
          <Search
            placeholder="Search Purchase Request"
            onSearch={(e) => setState({ ...state, filter: e })}
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
          <FilterSelect
            allowClear
            defaultValue={account?.office?.id}
            loading={loading}
            field="office"
            placeholder="Filter By Office"
            onChange={(e) => {
              setOffice(e);
            }}
            list={_.get(data, "offices")}
          />
        </Col>
        <Col span={24}>
          <Divider />
          <Table
            loading={loading || upsertLoading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={_.get(data, "list.content", [])}
            rowKey={(record) => record.id}
            size="small"
            pagination={{
              pageSize: _.get(data, "list.size", 0),
              total: _.get(data, "list.totalElements", 0),
              defaultCurrent: _.get(data, "list.number", 0) + 1,
              onChange: (page) => {
                setState({ ...state, page: page - 1 });
              },
            }}
          />
        </Col>
      </Row>
      {modal}
    </Card>
  );
};

export default PRContent;
