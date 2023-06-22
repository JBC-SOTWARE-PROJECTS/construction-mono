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
  Typography,
  Modal,
} from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { dialogHook, useLocalStorage } from "../../util/customhooks";
import {
  col2,
  SORT_TYPE,
  SORT_BY,
  col3,
  JOB_STATUS,
} from "../../shared/constant";
import FilterSelect from "../../util/customForms/filterSelect";
import moment from "moment";
import numeral from "numeral";
import JobOrderForm from "./dialogs/jobForm";
// import UpdateJobStatusForm from "./dialogs/updateJobForm";
import AddJobOrderForm from "./dialogs/addJobOrder";

const { Search } = Input;
const { Text } = Typography;
const { confirm } = Modal;
const options = ["Edit", "View Charges", "Update Status"];

//graphQL Queries
const GET_RECORDS = gql`
  query (
    $filter: String
    $status: String
    $customer: UUID
    $project: UUID
    $asset: UUID
    $sortBy: String
    $sortType: String
    $page: Int
    $size: Int
  ) {
    list: jobOrderListFilterPageable(
      filter: $filter
      status: $status
      customer: $customer
      project: $project
      asset: $asset
      sortBy: $sortBy
      sortType: $sortType
      page: $page
      size: $size
    ) {
      content {
        id
        dateTrans
        code
        description
        durationStart
        durationEnd
        customer {
          id
          fullName
          address
        }
        project {
          id
          description
        }
        assets {
          id
          description
        }
        remarks
        status
      }
      size
      totalElements
      number
    }
    customer: customerAssets {
      value: id
      label: fullName
    }
  }
`;

const JobOrders = ({ account }) => {
  const [customer, setCustomer] = useState(null);
  const [sort, setSort] = useLocalStorage("sorting", {
    sortBy: "code",
    sortType: "DESC",
  });
  const [state, setState] = useState({
    filter: "",
    status: null,
    project: null,
    asset: null,
    page: 0,
    size: 10,
  });
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      status: state.status,
      customer: customer,
      project: state.project,
      asset: state.asset,
      sortBy: sort.sortBy,
      sortType: sort.sortType,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "network-only",
  });

  const [modal, showModal] = dialogHook(AddJobOrderForm, (result) => {
    // item form
    if (result) {
      message.success(result);
    }
    refetch();
  });

  const [jobDetails, showJobDetails] = dialogHook(JobOrderForm, (result) => {
    // item form
    if (result) {
      message.success(result);
    }
    refetch();
  });

  // const [updateStatus, showUpdateModal] = dialogHook(
  //   UpdateJobStatusForm,
  //   (result) => {
  //     // item form
  //     if (result) {
  //       upsertRecord({
  //         variables: {
  //           status: result?.status,
  //           id: result?.id,
  //         },
  //       });
  //     }
  //   }
  // );

  //======================= =================== =================================================//
  const pushToBilling = (id) => {
    confirm({
      title: `Do you want pushed this Job Order to Billing?`,
      icon: <ExclamationCircleOutlined />,
      content: "Please click ok to proceed.",
      onOk() {
        pushToBill({
          variables: {
            jobId: id,
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
    if (option === "Push to Bill") {
      result =
        record?.billed ||
        record?.status === "CANCELLED" ||
        record.totalCost <= 0;
    }
    return result;
  };

  const menus = (record) => (
    <Menu
      onClick={(e) => {
        if (e.key === "Edit") {
          showModal({ show: true, myProps: record });
        } else if (e.key === "Update Status") {
          showUpdateModal({ show: true, myProps: record });
        } else if (e.key === "View Charges") {
          showJobDetails({ show: true, myProps: record });
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
        <ul className="w-full list-none">
          <li className="w-full flex">
            <div className="font-bold w-20">Remarks/Notes :</div>
            <div>
              <pre>{record.remarks}</pre>
            </div>
          </li>
        </ul>
      </div>
    );
  };

  const columns = [
    {
      title: "JO #",
      dataIndex: "code",
      key: "code",
      fixed: "left",
      width: 150,
    },
    {
      title: "Transaction Date",
      dataIndex: "dateTrans",
      key: "dateTrans",
      render: (text, record) => (
        <span>{moment(record?.dateTrans).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      title: "Job Description",
      dataIndex: "description",
      key: "description",
      render: (description) => <span>{_.toUpper(description)}</span>,
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      render: (text, record) => (
        <span key={text}>{record.project?.description}</span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => (
        <span key={text}>{record?.customer?.fullName}</span>
      ),
    },
    {
      title: "Job Duration Start Date",
      dataIndex: "durationStart",
      key: "durationStart",
      render: (text, record) => (
        <span>{moment(record?.durationStart).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      title: "Job Duration End Date",
      dataIndex: "durationEnd",
      key: "durationEnd",
      render: (text, record) => (
        <span>{moment(record?.durationEnd).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      title: "Duration (days)",
      dataIndex: "duration",
      key: "duration",
      render: (text, record) => {
        let start = moment(record?.durationStart);
        return (
          <Tag color="cyan">
            {moment(record?.durationEnd).diff(start, "days")} day(s)
          </Tag>
        );
      },
    },
    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
      fixed: "right",
      width: 150,
      render: (totalCost) => (
        <Text type="success">{numeral(totalCost).format("0,0.00")}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 200,
      render: (status, record) => {
        let color = "blue";
        if (record.status === "COMPLETED") {
          color = "green";
        } else if (record.status === "CANCELLED") {
          color = "red";
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
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
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
      title="Job Order List"
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
            New Job Order
          </Button>
        </span>
      }
    >
      <Row>
        <Col span={24}>
          <Search
            placeholder="Search Job Order"
            onSearch={(e) => setState({ ...state, filter: e })}
            enterButton
          />
        </Col>
        <Col span={24}>
          <Divider>Filters</Divider>
        </Col>
        <Col {...col3}>
          <FilterSelect
            allowClear
            loading={loading}
            field="customer"
            placeholder="Filter By Customer"
            onChange={(e) => {
              setCustomer(e);
            }}
            list={_.get(data, "customer", [])}
          />
        </Col>
        <Col {...col3}>
          <FilterSelect
            allowClear
            field="status"
            placeholder="Filter By Status"
            onChange={(e) => {
              setState({ ...state, status: e });
            }}
            list={JOB_STATUS}
          />
        </Col>
        <Col {...col3}>
          <FilterSelect
            allowClear
            field="office"
            placeholder="Filter By Project"
            onChange={(e) => {
              setState({ ...state, office: e });
            }}
            list={_.get(data, "office", [])}
          />
        </Col>
        <Col span={24}>
          <Divider>Sort By</Divider>
        </Col>
        <Col {...col2}>
          <FilterSelect
            field="sortBy"
            placeholder="Sort By"
            defaultValue={sort.sortBy}
            onChange={(e) => {
              setSort({ ...sort, sortBy: e });
            }}
            list={SORT_BY}
          />
        </Col>
        <Col {...col2}>
          <FilterSelect
            field="sortType"
            placeholder="Sort Type"
            defaultValue={sort.sortType}
            onChange={(e) => {
              setSort({ ...sort, sortType: e });
            }}
            list={SORT_TYPE}
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
            expandedRowRender={(record) => renderExpandableRow(record)}
            pagination={{
              pageSize: _.get(data, "list.size", 0),
              total: _.get(data, "list.totalElements", 0),
              defaultCurrent: _.get(data, "list.number", 0) + 1,
              onChange: (page) => {
                setState({ ...state, page: page - 1 });
              },
            }}
            scroll={{
              x: 3000,
            }}
          />
        </Col>
      </Row>
      {modal}
      {/* {updateStatus} */}
      {jobDetails}
    </Card>
  );
};

export default JobOrders;
