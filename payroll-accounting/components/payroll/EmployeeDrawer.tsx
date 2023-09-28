import React, { useState } from "react";
import { Button, Drawer, Table } from "antd";
import { Employee } from "@/graphql/gql/graphql";

interface IProps {
  selectedEmployees: Employee[];
  loading: boolean;
  usage?: string;
  setDisplayedEmployee?: (any: any) => void;
}

const EmployeeDrawer = ({
  selectedEmployees = [],
  loading,
  usage,
  setDisplayedEmployee,
}: IProps) => {
  const [open, setOpen] = useState(false);

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
      key: "fullName",
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "end", marginBottom: 15 }}>
        <Button type="primary" onClick={showDrawer} loading={loading}>
          {usage === "TIMEKEEPING"
            ? "Select Employee"
            : `View Selected (
          ${selectedEmployees?.length})`}
        </Button>
      </div>

      <Drawer
        title="Selected Employees"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Table
          columns={columns}
          dataSource={selectedEmployees}
          size="small"
          showHeader={false}
          pagination={false}
          loading={loading}
          rowSelection={{
            onSelect: (employee) => {
              if (usage === "TIMEKEEPING") {
                setDisplayedEmployee && setDisplayedEmployee(employee);
              }
            },
            type: usage === "TIMEKEEPING" ? "radio" : "checkbox",
          }}
        />
      </Drawer>
    </>
  );
};

export default EmployeeDrawer;
