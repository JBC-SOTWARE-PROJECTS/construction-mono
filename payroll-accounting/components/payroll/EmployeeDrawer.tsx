import React, { useEffect, useState } from "react";
import { Button, Divider, Drawer, Input, Select, Table, Tag } from "antd";
import { Employee, TimekeepingEmployeeDto } from "@/graphql/gql/graphql";
import { setFips } from "crypto";
import { getStatusColor } from "@/utility/helper";

interface IProps {
  selectedEmployees: Employee[];
  loading: boolean;
  usage?: string;
  setDisplayedEmployee?: (any: any) => void;
  children: any;
  icon?: any;
}

const EmployeeDrawer = ({
  selectedEmployees = [],
  loading,
  usage,
  setDisplayedEmployee,
  children,
  icon,
}: IProps) => {
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("");

  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Employee",
      dataIndex: "fullName",
      render: (value: string, { status }: any) => {
        return (
          <>
            {value}{" "}
            {status && <Tag color={getStatusColor(status)}>{status}</Tag>}
          </>
        );
      },
    },
  ];
  const handleSearch = (value: any) => {
    setFilter(value);
  };
  useEffect(() => {
    setFilteredEmployees([...selectedEmployees]);
  }, [selectedEmployees]);

  const filterEmployees = () => {
    const newEmployees = selectedEmployees?.filter((item: any) => {
      return (
        item?.fullName
          ?.toLowerCase()
          .includes(filter?.toLowerCase() as string) &&
        (statusFilter.length > 0 ? statusFilter.includes(item?.status) : true)
      );
    });

    return newEmployees;
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "end", marginBottom: 15 }}>
        <Button
          type="primary"
          onClick={showDrawer}
          loading={loading}
          icon={icon && icon}
        >
          {children}
        </Button>
      </div>

      <Drawer
        title="Selected Employees"
        placement="right"
        onClose={onClose}
        open={open}
        destroyOnClose
        width={800}
      >
        {usage === "TIMEKEEPING" && (
          <>
            <Input.Search
              size="middle"
              onSearch={handleSearch}
              allowClear
              placeholder="Search Employee"
            />
            <Select
              placeholder="Filter Status"
              mode="multiple"
              options={[{ value: "DRAFT" }, { value: "FINALIZED" }]}
              style={{ width: "100%", marginTop: 5 }}
              onChange={(val) => {
                setStatusFilter(val);
              }}
              allowClear
              showSearch
            />
            <Divider />
          </>
        )}

        <Table
          columns={columns}
          dataSource={
            usage === "TIMEKEEPING" ? filterEmployees() : selectedEmployees
          }
          size="small"
          pagination={false}
          loading={loading}
          rowKey={({ id }) => id}
          rowSelection={
            usage === "TIMEKEEPING"
              ? {
                  onSelect: (employee) => {
                    setDisplayedEmployee && setDisplayedEmployee(employee);
                  },
                  type: "radio",
                }
              : (null as any)
          }
          showHeader={false}
        />
      </Drawer>
    </>
  );
};

export default EmployeeDrawer;
