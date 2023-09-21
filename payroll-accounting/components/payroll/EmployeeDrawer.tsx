import React, { useState } from "react";
import { Button, Drawer, Table } from "antd";
import { Employee } from "@/graphql/gql/graphql";

interface IProps {
  selectedEmployees: Employee[];
  loading: boolean;
}

const EmployeeDrawer = ({ selectedEmployees = [], loading }: IProps) => {
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
          View Selected ({selectedEmployees?.length})
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
        />
      </Drawer>
    </>
  );
};

export default EmployeeDrawer;
