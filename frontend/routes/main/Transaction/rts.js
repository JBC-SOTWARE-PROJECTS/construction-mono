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
import RTSForm from "./dialogs/rtsForm";
import PostSupplierReturns from "../postDialogs/postReturn";

const { Search } = Input;
const { confirm } = Modal;
const options = ["Edit", "Post", "Void", "Print"];

//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $office: UUID, $page: Int, $size: Int) {
    list: rtsByFiltersPage(
      filter: $filter
      office: $office
      page: $page
      size: $size
    ) {
      content {
        id
        rtsNo
        returnDate
        refSrr
        receivedRefNo
        receivedRefDate
        office {
          id
          officeDescription
        }
        supplier {
          id
          supplierFullname
        }
        received_by
        returnBy
        returnUser
        isPosted
        isVoid
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
    upsert: updateRTSStatus(status: $status, id: $id) {
      id
    }
  }
`;

const RTSContent = ({ account }) => {
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

  const [modal, showModal] = dialogHook(RTSForm, (result) => {
    // item form
    if (result) {
      message.success(result);
      refetch();
    }
  });

  const [modalPost, showPostModal] = dialogHook(
    PostSupplierReturns,
    (result) => {
      // item form
      if (result) {
        message.success(result);
        refetch();
      }
    }
  );

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          message.success("Return to Supplier Information Updated");
          refetch();
        }
      },
    }
  );

  //======================= =================== =================================================//
  const _approve = (id, status, message) => {
    confirm({
      title: `Do you want ${message} this Return?`,
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
        } else if (e.key === "Print") {
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
      title: "RTS Date",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (text, record) => (
        <span key={text}>
          {moment(record?.returnDate).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "RTS #",
      dataIndex: "rtsNo",
      key: "rtsNo",
    },
    {
      title: "Ref #",
      dataIndex: "refSrr",
      key: "refSrr",
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier",
      render: (text, record) => (
        <span key={text}>{record?.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isPosted",
      key: "isPosted",
      render: (status, record) => {
        let color = status ? "green" : "blue";
        let text = status ? "POSTED" : "NEW";
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
      title="Return to Supplier List"
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
            New Return to Supplier
          </Button>
        </span>
      }
    >
      <Row>
        <Col {...col18}>
          <Search
            placeholder="Search Returns"
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

export default RTSContent;
