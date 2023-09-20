import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import RawLogs from "@/components/payroll/employee-management/attendance/RawLogs";
import AccumulatedLogs from "@/components/payroll/employee-management/attendance/AccumulatedLogs";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Accumulated Logs",
    children: <AccumulatedLogs />,
  },
  {
    key: "2",
    label: "Raw Attendance Logs",
    children: <RawLogs />,
  },
];
function EmployeeSchedulePage() {
  return (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
}

export default EmployeeSchedulePage;
