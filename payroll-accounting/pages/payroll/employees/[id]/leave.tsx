import EmployeeManagementHeader from "@/components/administrative/employees/EmployeeManagementHeader";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import UpsertEmployeeLeaveModal from "@/components/payroll/employee-management/leave/UpsertEmployeeLeaveModal";
import {
  EmployeeLeave,
  LeaveStatus,
  SelectedDate,
} from "@/graphql/gql/graphql";
import { useGetEmployeeById } from "@/hooks/employee";
import useGetEmployeeLeave from "@/hooks/employee-leave/useGetEmployeeLeave";
import { getStatusColor } from "@/utility/helper";
import { Divider, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/router";

function EmployeeLoansPage() {
  const router = useRouter();
  const [employee, loadingEmployee] = useGetEmployeeById(router?.query?.id);
  const [leave, loadingLeave, refetch] = useGetEmployeeLeave();
  const columns: ColumnsType<EmployeeLeave> = [
    {
      title: "Created Date",
      dataIndex: "createdDate",
      render: (value) => dayjs(value).format(" MMMM D, YYYY,  hh:mm a"),
    },
    {
      title: "Leave Type",
      dataIndex: "type",
      render: (value) => value.replace("_", " "),
    },
    {
      title: "Selecteed Leave Dates",
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
        <UpsertEmployeeLeaveModal record={record} refetch={refetch} />
      ),
      width: 80,
    },
  ];

  return (
    <>
      <EmployeeManagementHeader title="Leave">
        <EmployeeDetails
          fullName={employee?.fullName}
          position={employee?.position?.description}
          loading={loadingEmployee}
        />
      </EmployeeManagementHeader>
      <Divider />

      <div style={{ display: "flex", justifyContent: "end", marginBottom: 15 }}>
        <UpsertEmployeeLeaveModal refetch={refetch} />
      </div>

      <Table columns={columns} dataSource={leave} />
    </>
  );
}

export default EmployeeLoansPage;
