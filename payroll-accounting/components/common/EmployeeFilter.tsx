import { useGetFilters } from "@/hooks/employee";
import { Select, Input, Space } from "antd";
import React from "react";

const { Search } = Input;
export const filterOptions = [
  {
    value: null,
    label: "All Employee",
    icon: "all-contacts",
  },
  {
    value: true,
    label: "Active Employee",
    icon: "check-circle-o",
  },
  {
    value: false,
    label: "Inactive Employee",
    icon: "close-circle",
  },
];
function EmployeeFilter({ setFilters }: any) {
  const [filterData] = useGetFilters();
  return (
    <Space>
      <Search
        size="middle"
        placeholder="Search here.."
        onSearch={(e: any) =>
          setFilters((prev: any) => ({ ...prev, filter: e }))
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
          setFilters((prev: any) => ({ ...prev, status: value }));
        }}
        options={filterOptions}
      />
      <Select
        allowClear
        style={{ width: 170 }}
        placeholder="Office"
        defaultValue={null}
        onChange={(value) => {
          setFilters((prev: any) => ({ ...prev, office: value }));
        }}
        options={filterData?.office}
      />
      <Select
        allowClear
        style={{ width: 170 }}
        placeholder="Position"
        defaultValue={null}
        onChange={(value) => {
          setFilters((prev: any) => ({ ...prev, position: value }));
        }}
        options={filterData.position}
      />
    </Space>
  );
}

export default EmployeeFilter;