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
} from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { dialogHook } from "../../../util/customhooks";
import { col4, col18 } from "../../../shared/constant";
import FilterSelect from "../../../util/customForms/filterSelect";
import moment from "moment";
import IssuanceForm from "./dialogs/issuanceForm";
import PostIssuance from "../postDialogs/postIssuance";

const { Search } = Input;
const { confirm } = Modal;
const options = ["Edit", "Post", "Void"];

//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $office: UUID, $page: Int, $size: Int) {
    list: stiByFiltersPage(
      filter: $filter
      office: $office
      page: $page
      size: $size
    ) {
      content {
        id
        issueNo
        issueDate
        issueFrom {
          id
          officeDescription
        }
        issueTo {
          id
          officeDescription
        }
        issueType
        issued_by {
          id
          fullName
        }
        project {
          id
          description
        }
        isCancel
        isPosted
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
    upsert: updateSTIStatus(status: $status, id: $id) {
      id
    }
  }
`;

const IssuanceContent = ({ account }) => {
  const [office, setOffice] = useState(account?.office?.id);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 20,
  });
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      office: office,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "network-only",
  });

  const [modal, showModal] = dialogHook(IssuanceForm, (result) => {
    // item form
    if (result) {
      message.success(result);
      refetch();
    }
  });

  const [modalPost, showPostModal] = dialogHook(PostIssuance, (result) => {
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
          message.success("Issuance/Expense Information Updated");
          refetch();
        }
      },
    }
  );

  //======================= =================== =================================================//
  const _approve = (id, status, message) => {
    confirm({
      title: `Do you want ${message} this Issuance/Expense?`,
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
    }
    return result;
  };

  const menus = (record) => (
    <Menu
      onClick={(e) => {
        if (e.key === "Edit") {
          showModal({ show: true, myProps: record });
        } else if (e.key === "Post") {
          showPostModal({ show: true, myProps: record });
        } else if (e.key === "Void") {
          _approve(record?.id, false, "void");
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

  const columns = [
    {
      title: "Date",
      dataIndex: "issueDate",
      key: "issueDate",
      render: (text, record) => (
        <span key={text}>
          {moment(record?.issueDate).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "Transaction #",
      dataIndex: "issueNo",
      key: "issueNo",
    },
    {
      title: "To",
      dataIndex: "issueTo",
      key: "issueTo",
      render: (text, record) => (
        <span key={text}>{record?.issueTo?.officeDescription}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "issueType",
      key: "issueType",
    },
    {
      title: "Status",
      dataIndex: "isPosted",
      key: "isPosted",
      render: (status, record) => {
        let color = status ? "green" : "blue";
        let text = status ? "POSTED" : "NEW";
        if (record.isCancel) {
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
      title="Issuance/Expense List"
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
            New Issuance/Expense
          </Button>
        </span>
      }
    >
      <Row>
        <Col {...col18}>
          <Search
            placeholder="Search Issuance/Expense"
            onSearch={(e) => setState({ ...state, filter: e })}
            enterButton
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
      {modalPost}
    </Card>
  );
};

export default IssuanceContent;
