import CustomButton from "@/components/common/CustomButton";
import AssignEmployeeScheduleModal from "@/components/payroll/employee-management/work-schedule/AssignEmployeeScheduleModal";
import EmployeeScheduleDetailsModal from "@/components/payroll/employee-management/work-schedule/EmployeeScheduleDetailsModal";
import ScheduleCell from "@/components/payroll/employee-management/work-schedule/ScheduleCell";
import { useDialog } from "@/hooks";
import useGetScheduleTypes from "@/hooks/configurations/useGetScheduleTypes";
import { useGetFilters } from "@/hooks/employee";
import useGetEmployeeSchedule from "@/hooks/employee-schedule/useGetEmployeeSchedule";
import useUpsertEmployeeSchedule from "@/hooks/employee-schedule/useUpsertEmployeeSchedule";
import { IPageProps } from "@/utility/interfaces";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { DatePicker, Input, Select, Table } from "antd";

import dayjs from "dayjs";
import { startCase, toLower } from "lodash";
import Head from "next/head";
import { useState } from "react";

const { Search } = Input;
interface IState {
  filter: string;
  page: number;
  size: number;
  status: boolean | null;
  office: string | null;
  position: string | null;
}

const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};

export default function ScheduleTypeSetup({ account }: IPageProps) {
  const [dates, setDates] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [filterData] = useGetFilters();
  const [state, setState] = useState(initialState);
  const [schedules, loadingSchedules] = useGetScheduleTypes();
  const { upsertEmployeeSchedule, loadingUpsert } = useUpsertEmployeeSchedule(
    () => {
      refetchEmployes();
    }
  );
  const [employees, loadingEmployees, refetchEmployes] = useGetEmployeeSchedule(
    {
      startDate: dates[0],
      endDate: dates[1],
      position: state.position,
      office: state.office,
      filter: state.filter,
    }
  );
  const showAssignSchedModal = useDialog(AssignEmployeeScheduleModal);
  const showScheduleDetailsModal = useDialog(EmployeeScheduleDetailsModal);

  const additionalColumns = () => {
    const start = dates[0];
    const end = dates[1];
    let currentDate = start.clone(); // Use .clone() to avoid modifying the original date
    let newColumns = [];

    while (currentDate.isBefore(end) || currentDate.isSame(end)) {
      const date = currentDate.clone();
      newColumns.push({
        title: currentDate.format("MMM DD, YYYY (ddd)"),
        dataIndex: ["schedule", currentDate.format("MM_DD_YYYY")],
        key: currentDate.format("MM_DD_YYYY"),
        width: 200,
        onCell: () => ({ className: "employee_schedule_table_cell" }),
        render: (val: any, { id, position, fullName }: any) => {
          return (
            <ScheduleCell
              currentDate={date}
              schedules={schedules}
              employeeSchedule={val}
              employee={{ id, position, fullName }}
              upsertEmpSchedule={upsertEmployeeSchedule}
              showScheduleDetailsModal={(props) => {
                showScheduleDetailsModal(
                  { ...props, refetchEmployes },
                  () => {}
                );
              }}
            />
          );
        },
      });

      currentDate = currentDate.add(1, "day");
    }
    return newColumns;
  };

  let columns = [
    {
      title: <></>,
      dataIndex: "fullName",
      key: "fullName",
      width: 300,
      render: (val: string) => {
        return startCase(toLower(val));
      },
    },
    ...additionalColumns(),
  ];

  const handleDateChange = (dates: any) => {
    try {
      setDates([dayjs(dates[0]).startOf("day"), dayjs(dates[1]).endOf("day")]);
    } catch {
      setDates([dayjs().startOf("month"), dayjs().endOf("month")]);
    }
  };

  return (
    <PageContainer title="Employee Schedule Management">
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        extra={
          <ProFormGroup>
            <DatePicker.RangePicker
              onChange={(dates: any) => {
                handleDateChange(dates);
              }}
            />
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) =>
                setState((prev: any) => ({ ...prev, filter: e }))
              }
              allowClear
              className="select-header"
            />
            <Select
              allowClear
              style={{ width: 170 }}
              placeholder="Office"
              defaultValue={null}
              onChange={(value) => {
                setState({ ...state, office: value });
              }}
              options={filterData?.office}
            />
            <Select
              allowClear
              style={{ width: 170 }}
              placeholder="Position"
              defaultValue={null}
              onChange={(value) => {
                setState({ ...state, position: value });
              }}
              options={filterData.position}
            />
            <CustomButton
              type="primary"
              icon={<PlusCircleOutlined />}
              allowedPermissions={["add_edit_schedule_type"]}
              onClick={() => {
                showAssignSchedModal({ refetchEmployes });
              }}
            >
              Assign Employee Schedule
            </CustomButton>
          </ProFormGroup>
        }
      >
        <Head>
          <title>Employee Schedule Management</title>
        </Head>
        <Table
          className="employee_schedule_table"
          rowKey="id"
          size="small"
          dataSource={employees}
          columns={columns}
          pagination={false}
          loading={loadingEmployees || loadingSchedules || loadingUpsert}
          scroll={{ x: 1600, y: "calc(100vh - 330px)" }}
        />
      </ProCard>
    </PageContainer>
  );
}
