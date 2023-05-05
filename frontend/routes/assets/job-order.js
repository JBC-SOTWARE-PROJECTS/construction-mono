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
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { dialogHook, useLocalStorage } from "../../util/customhooks";
import { col4, col2, SORT_TYPE, SORT_BY } from "../../shared/constant";
import FilterSelect from "../../util/customForms/filterSelect";
import { getUrlPrefix } from "../../shared/global";
import moment from "moment";
import numeral from "numeral";
// import JobOrderForm from "./dialogs/jobForm";
// import UpdateJobStatusForm from "./dialogs/updateJobForm";
// import AddJobOrderForm from "./dialogs/addJobOrder";

const { Search } = Input;
const { Text } = Typography;
const { confirm } = Modal;
const options = [
  "Edit",
  "View Charges",
  "Push to Bill",
  "Update Status",
  "Endorsement Form",
  "Print",
];

//graphQL Queries
// const GET_RECORDS = gql`
//   query (
//     $filter: String
//     $customer: UUID
//     $status: String
//     $office: UUID
//     $insurance: UUID
//     $sortBy: String
//     $sortType: String
//     $page: Int
//     $size: Int
//   ) {
//     list: jobByFiltersPage(
//       filter: $filter
//       customer: $customer
//       status: $status
//       office: $office
//       insurance: $insurance
//       sortBy: $sortBy
//       sortType: $sortType
//       page: $page
//       size: $size
//     ) {
//       content {
//         id
//         dateTrans
//         deadline
//         jobNo
//         description
//         customer {
//           id
//           customerType
//           address
//           fullName
//         }
//         repair {
//           id
//           description
//         }
//         insurance {
//           id
//           description
//         }
//         office {
//           id
//           officeDescription
//         }
//         odometerReading
        
//       size
//       totalElements
//       number
//     }
//     customer: customerAll {
//       value: id
//       label: fullName
//     }
//   }
// `;

const UPSERT_RECORD = gql`
  mutation ($status: String, $id: UUID) {
    upsert: updateJobStatus(status: $status, id: $id) {
      id
    }
  }
`;

const PUSH_BILLING = gql`
  mutation ($jobId: UUID) {
    upsert: pushToBill(jobId: $jobId) {
      id
    }
  }
`;

const JobOrders = ({ account }) => {
  const [customer, setCustomer] = useState(null);
  const [sort, setSort] = useLocalStorage("sorting", {
    sortBy: "jobNo",
    sortType: "DESC",
  });
  const [state, setState] = useState({
    filter: "",
    status: null,
    office: null,
    insurance: null,
    page: 0,
    size: 10,
  });
  //query
  // const { loading, data, refetch } = useQuery(GET_RECORDS, {
  //   variables: {
  //     filter: state.filter,
  //     customer: customer,
  //     status: state.status,
  //     insurance: state.insurance,
  //     sortBy: sort.sortBy,
  //     sortType: sort.sortType,
  //     page: state.page,
  //     size: state.size,
  //   },
  //   fetchPolicy: "network-only",
  // });

  // const [modal, showModal] = dialogHook(AddJobOrderForm, (result) => {
  //   // item form
  //   if (result) {
  //     message.success(result);
  //   }
  //   refetch();
  // });

  // const [jobDetails, showJobDetails] = dialogHook(JobOrderForm, (result) => {
  //   // item form
  //   if (result) {
  //     message.success(result);
  //   }
  //   refetch();
  // });

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

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          message.success("Job Order Information Updated");
          refetch();
        }
      },
    }
  );

  const [pushToBill, { loading: pushToBillLoading }] = useMutation(
    PUSH_BILLING,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data)) {
          message.success(`Job Order successfully pushed to bill`);
          refetch();
        }
      },
    }
  );

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
        } else if (e.key === "Push to Bill") {
          pushToBilling(record?.id);
        } else if (e.key === "Print") {
          window.open(
            `${getUrlPrefix()}/reports/billing/print/job-order/${record?.id}`
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
        <ul className="w-full list-none">
          <li className="w-full flex">
            <div className="font-bold w-20">Body Color :</div>
            <div>{record.bodyColor}</div>
          </li>
          <li className="w-full flex">
            <div className="font-bold w-20">Year Model :</div>
            <div>{record.yearModel}</div>
          </li>
          <li className="w-full flex">
            <div className="font-bold w-20">Series Number :</div>
            <div>{record.series}</div>
          </li>
          <li className="w-full flex">
            <div className="font-bold w-20">Make (Brand) :</div>
            <div>{record.make}</div>
          </li>
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
      dataIndex: "jobNo",
      key: "jobNo",
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
      title: "Plate No",
      dataIndex: "plateNo",
      key: "plateNo",
      render: (plateNo) => <span>{_.toUpper(plateNo)}</span>,
    },
    {
      title: "Job Description",
      dataIndex: "description",
      key: "description",
      render: (description) => <span>{_.toUpper(description)}</span>,
    },
    {
      title: "Engine No",
      dataIndex: "engineNo",
      key: "engineNo",
      render: (engineNo) => <span>{_.toUpper(engineNo)}</span>,
    },
    {
      title: "Chassis No",
      dataIndex: "chassisNo",
      key: "chassisNo",
      render: (chassisNo) => <span>{_.toUpper(chassisNo)}</span>,
    },
    {
      title: "Repair Type",
      dataIndex: "repair",
      key: "repair",
      render: (text, record) => (
        <span key={text}>{record.repair?.description}</span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "deadline",
      key: "deadline",
      render: (text, record) => {
        let due = moment(record?.deadline).diff(moment(), "days");
        let params = {
          color: "blue",
          text: `Due in ${due} days`,
          icon: <InfoCircleOutlined />,
        };
        if (due <= 10 && due > 0) {
          params = {
            color: "orange",
            text: `Due in ${due} ${due === 1 ? "day" : "days"}`,
            icon: <WarningOutlined />,
          };
        } else if (due <= 0) {
          params = {
            color: "red",
            text: `${due == 0 ? "Due Today" : "Past Due"}`,
            icon: <StopOutlined />,
          };
        }
        if (record?.completed) {
          params = {
            color: "green",
            text: "",
            icon: <CheckCircleOutlined />,
          };
        }
        return (
          <span>
            <Tag key={text} icon={params.icon} color={params.color}>
              {moment(record?.deadline).format("MMM DD, YYYY") +
                " " +
                params.text}
            </Tag>
          </span>
        );
      },
    },
    {
      title: "Office Location",
      dataIndex: "office",
      key: "office",
      render: (text, record) => (
        <span key={text}>{record.office?.officeDescription}</span>
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
      title: "Insurance",
      dataIndex: "insurance",
      key: "insurance",
      render: (text, record) => (
        <span key={text}>{record?.insurance?.description}</span>
      ),
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
        if (record.completed) {
          color = "green";
        } else if (record.pending || record.status === "DUGTA") {
          color = "orange";
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
        <Col {...col4}>
          <FilterSelect
            allowClear
            // loading={loading}
            field="customer"
            placeholder="Filter By Customer"
            onChange={(e) => {
              setCustomer(e);
            }}
            list={[]} //_.get(data, "customer")
          />
        </Col>
        <Col {...col4}>
          <FilterSelect
            allowClear
            field="status"
            placeholder="Filter By Status"
            onChange={(e) => {
              setState({ ...state, status: e });
            }}
            list={[]} //_.get(data, "jobStatus")
          />
        </Col>
        <Col {...col4}>
          <FilterSelect
            allowClear
            field="office"
            placeholder="Filter By Office"
            onChange={(e) => {
              setState({ ...state, office: e });
            }}
            list={[]} //_.get(data, "office")
          />
        </Col>
        <Col {...col4}>
          <FilterSelect
            allowClear
            field="insurance"
            placeholder="Filter By Insurance"
            onChange={(e) => {
              setState({ ...state, insurance: e });
            }}
            list={[]} //_.get(data, "insurance")
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
            // loading={loading || upsertLoading || pushToBillLoading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={[]} //_.get(data, "list.content", [])
            rowKey={(record) => record.id}
            expandedRowRender={(record) => renderExpandableRow(record)}
            // pagination={{
            //   pageSize: _.get(data, "list.size", 0),
            //   total: _.get(data, "list.totalElements", 0),
            //   defaultCurrent: _.get(data, "list.number", 0) + 1,
            //   onChange: (page) => {
            //     setState({ ...state, page: page - 1 });
            //   },
            // }}
            scroll={{
              x: 3000,
            }}
          />
        </Col>
      </Row>
      {/* {modal}
      {updateStatus}
      {jobDetails} */}
    </Card>
  );
};

export default JobOrders;
