import CustomButton from "@/components/common/CustomButton";
import ScheduleCell from "@/components/payroll/employee-schedule/ScheduleCell";
import { EmployeeSchedule } from "@/graphql/gql/graphql";
import useGetScheduleTypes from "@/hooks/configurations/useGetScheduleTypes";
import { IPageProps } from "@/utility/interfaces";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { MenuProps, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Head from "next/head";
import { useState } from "react";

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

const dummayData = [
  {
    fullName: "John Michael Hinacay",
    // 08_01_2023
  },
];

const items: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "1",
  },
  {
    label: "2nd menu item",
    key: "2",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

export default function ScheduleTypeSetup({ account }: IPageProps) {
  const [schedules, loading] = useGetScheduleTypes();
  const [dates, setDates] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const additionalColumns = () => {
    const start = dates[0];
    const end = dates[1];
    let currentDate = start.clone(); // Use .clone() to avoid modifying the original date
    let newColumns = [];

    while (currentDate.isBefore(end) || currentDate.isSame(end)) {
      newColumns.push({
        title: currentDate.format("MMM DD, YYYY (ddd)"),
        dataIndex: currentDate.format("MM_dd_yyyy"),
        key: currentDate.format("MM_dd_yyyy"),
        width: 150,
        render: (val: string, { id }: EmployeeSchedule) => {
          return <ScheduleCell schedules={schedules} employeeId={id} />;
        },
      });
      currentDate = currentDate.add(1, "day");
    }

    return newColumns;
  };

  let columns: ColumnsType<EmployeeSchedule> = [
    {
      title: <></>,
      dataIndex: "fullName",
      key: "fullName",
      width: 300,
    },
    ...additionalColumns(),
  ];
  return (
    <PageContainer title="Employee Schedule Management">
      <ProCard
        // title="Employee Schedule Management"
        headStyle={{
          flexWrap: "wrap",
        }}
        extra={
          <ProFormGroup>
            <CustomButton
              type="primary"
              icon={<PlusCircleOutlined />}
              allowedPermissions={["add_edit_schedule_type"]}
            >
              Create New
            </CustomButton>
          </ProFormGroup>
        }
      >
        <Head>
          <title>Employee Schedule Management</title>
        </Head>
        <Table
          rowKey="id"
          size="small"
          dataSource={dummayData}
          columns={columns}
          pagination={false}
          scroll={{ x: 1600, y: "calc(100vh - 330px)" }}
        />
      </ProCard>
    </PageContainer>
  );
}
