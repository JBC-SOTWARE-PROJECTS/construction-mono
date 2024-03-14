import { Employee } from "@/graphql/gql/graphql";
import { getStatusColor } from "@/utility/helper";
import { Button, Divider, Drawer, Input, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import EmployeeFilter from "../common/EmployeeFilter";

interface IProps {
  selectedEmployees: Employee[];
  loading: boolean;
  usage?: string;
  children: any;
  icon?: any;
  onSelect?: (any: any) => void;
  selectedRowKeys?: string[];
  setFilters?: () => any;
}

const EmployeeDrawer = ({
  selectedEmployees = [],
  loading,
  usage,
  onSelect,
  children,
  icon,
  selectedRowKeys,
  setFilters,
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
        title="Employees"
        placement="right"
        onClose={onClose}
        open={open}
        destroyOnClose
        width={"50%"}
      >
        {(usage === "TIMEKEEPING" || usage === "MULTI") && (
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

        {usage === "EMPLOYEE_SWITCHING" && (
          <>
            <EmployeeFilter setFilters={setFilters} /> <br />
            <br />
          </>
        )}

        <Table
          columns={columns}
          dataSource={
            usage === "TIMEKEEPING" || usage === "MULTI"
              ? filterEmployees()
              : selectedEmployees
          }
          size="small"
          pagination={false}
          loading={loading}
          rowKey={({ id }) => id}
          rowSelection={
            usage === "TIMEKEEPING" || usage === "EMPLOYEE_SWITCHING"
              ? {
                  onSelect: (employee) => {
                    if (onSelect) onSelect(employee);
                  },
                  type: "radio",
                  ...(selectedRowKeys
                    ? { selectedRowKeys: selectedRowKeys }
                    : {}),
                }
              : usage === "MULTI"
              ? {
                  onChange: (selectedRowKeys, selectedRows) => {
                    if (onSelect) onSelect(selectedRows);
                    onClose();
                  },
                  type: "checkbox",
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
