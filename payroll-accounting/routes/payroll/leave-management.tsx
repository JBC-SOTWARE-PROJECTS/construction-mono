import FormSearch from "@/components/common/formSearch";
import FormSelect from "@/components/common/formSelect/formSelect";
import UpsertEmployeeLeaveModal from "@/components/payroll/employee-management/leave/UpsertEmployeeLeaveModal";
import {
  EmployeeLeave,
  EmployeeLeaveDto,
  LeaveStatus,
  LeaveType,
  SelectedDate,
} from "@/graphql/gql/graphql";
import { useGetFilters } from "@/hooks/employee";
import useGetEmployeeLeavePageable from "@/hooks/employee-leave/useGetEmployeeLeavePageable";
import usePaginationState from "@/hooks/usePaginationState";
import { getStatusColor } from "@/utility/helper";
import { IPageProps } from "@/utility/interfaces";
import { PageHeader } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd/lib";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
interface variables {
  page: number;
  size: number;
  position: string | null;
  office: string | null;
  leaveTypes: LeaveType[];
  status: LeaveStatus[];
  filter: string;
}

const initialState: variables = {
  size: 25,
  page: 0,
  position: null,
  office: null,
  leaveTypes: [],
  status: [],
  filter: "",
};
function LeaveManagementComponent({ account }: IPageProps) {
  const [filterData] = useGetFilters();
  const router = useRouter();
  const [state, { onNextPage, onQueryChange }] = usePaginationState(
    initialState,
    0,
    25
  );
  const [data, loading, refetch, totalElements] =
    useGetEmployeeLeavePageable(state);

  const columns: ColumnsType<EmployeeLeaveDto> = [
    {
      title: "Employee",
      dataIndex: "fullName",
      render: (value, { employeeId }) => {
        //   <Link
        //   href={`${router.asPath}${item.link}`}
        //   passHref
        //   legacyBehavior
        //   key={index}
        //   style={{ display: "inline" }}
        // >
        return (
          <a
            onClick={() => {
              router.push(`/payroll/employees/${employeeId}/leave`);
            }}
            style={{ textDecoration: "none" }}
          >
            {value}
          </a>
        );
        {
          /* </Link> */
        }
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      render: (value) => dayjs(value).format(" MMMM D, YYYY,  hh:mm a"),
    },
    {
      title: "Leave Type",
      dataIndex: "type",
      render: (value) => value?.replace("_", " "),
    },
    {
      title: "Selected Leave Dates",
      dataIndex: "dates",
      render: (value: SelectedDate[]) => {
        return value?.map((item) => {
          return (
            <Tag key={item.startDatetime}>
              {dayjs(item.startDatetime).format("MMM DD, YYYY")}
            </Tag>
          );
        });
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "With Pay",
      dataIndex: "withPay",
      render: (value) => (
        <Tag color={value ? "green" : "orange"}>{value ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },

    {
      title: "Actions",
      dataIndex: "id",
      render: (value, record) => (
        <UpsertEmployeeLeaveModal record={record} refetch={() => {}} />
      ),
      width: 80,
    },
  ];
  return (
    <div>
      <Head>
        <title>Employee Leave Management</title>
      </Head>
      <PageHeader title="Employee Leave Management" />

      <Row gutter={[12, 12]}>
        <Col md={5}>
          <FormSearch
            label="Search Employee"
            style={{ width: "100%" }}
            propssearch={{
              placeholder: "Search Employees",
              onSearch: (value) => {
                onQueryChange("filter", value);
              },
              allowClear: true,
            }}
          />
        </Col>

        <Col md={5}>
          <FormSelect
            label="Position"
            name="position"
            propsselect={{
              showArrow: true,
              placeholder: "Filter Position",
              showSearch: true,
              onChange: (value) => onQueryChange("position", value),
              options: filterData?.position,
            }}
          />
        </Col>
        <Col md={5}>
          <FormSelect
            label="Office"
            name="office"
            propsselect={{
              showArrow: true,
              placeholder: "Filter Office",
              showSearch: true,
              onChange: (value) => onQueryChange("office", value),
              options: filterData?.office,
            }}
          />
        </Col>
        <Col md={5}>
          <FormSelect
            label="Leave Type"
            name="leaveTypes"
            propsselect={{
              showArrow: true,
              placeholder: "Filter Leave Type",
              showSearch: true,
              mode: "multiple",
              allowClear: true,
              onChange: (value) => onQueryChange("leaveTypes", value),
              options: Object.values(LeaveType).map((item) => ({
                value: item,
                label: item.replace("_", " "),
              })),
            }}
          />
        </Col>
        <Col md={4}>
          <FormSelect
            label="Status"
            name="status"
            propsselect={{
              showArrow: true,
              placeholder: "Filter Status",
              showSearch: true,
              mode: "multiple",
              allowClear: true,
              onChange: (value) => onQueryChange("status", value),
              options: Object.values(LeaveStatus).map((item) => ({
                value: item,
                label: item.replace("_", " "),
              })),
            }}
          />
        </Col>
      </Row>
      <Table onChange={onNextPage} columns={columns} dataSource={data} />
    </div>
  );
}

export default LeaveManagementComponent;
