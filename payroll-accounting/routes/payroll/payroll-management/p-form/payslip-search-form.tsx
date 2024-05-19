import React, { useState } from "react";
import { Button, Divider, Input, Row, Table, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ArrowDownOutlined, PrinterOutlined } from "@ant-design/icons";
import { getUrlPrefix } from "@/utility/graphql-client";
import { useRouter } from "next/router";

const { Search } = Input;

interface DataType {
  id: string;
  key: React.Key;
  name: string;
}

interface FormProps {
  data: any;
  filter: "" | any;
  loading: boolean;
  onSearch: (value: string) => void;
}

function PayslipSearchForm({ data, filter, loading, onSearch }: FormProps) {
  const [searchValue, setSearchValue] = useState(filter);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const router = useRouter();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRows(newSelectedRowKeys);
  };

  console.log("data", data);

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<DataType> = [
    {
      key: "employee",
      title: "Employee",
      dataIndex: "fullName",
    },
    {
      key: "position",
      title: "Position",
      dataIndex: "position",
    },
    {
      key: "timekeepingStatus",
      title: "TimeKeeping Status",
      dataIndex: "timekeepingStatus",
    },
    {
      key: "contributionStatus",
      title: "Contribution Status",
      dataIndex: "contributionStatus",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          gap: 5,
          marginBottom: 10,
        }}
      >
        <Search
          allowClear
          style={{ width: "100%", marginBottom: 10 }}
          size="middle"
          placeholder="Search employee here..."
          className="select-header-list"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={() => onSearch(searchValue)}
        />

        <Button
          type="primary"
          icon={<ArrowDownOutlined />}
          onClick={() =>
            selectedRows.length
              ? window.open(
                  `${getUrlPrefix()}/reports/payroll/print/payslipPayroll/${selectedRows}`
                )
              : notification.warning({
                  message: "No Employee Selected",
                  description:
                    "Please select at least one employee to proceed.",
                })
          }
        >
          DownLoad Payslip
        </Button>

        <Divider type="vertical" />

        <Button
          type="primary"
          icon={<PrinterOutlined />}
          size="middle"
          onClick={() =>
            window.open(
              getUrlPrefix() +
                "/reports/payroll/print/payrollPerRegister?id=" +
                router?.query?.id
            )
          }
        >
          DownLoad Register Per Project
        </Button>

        <Divider type="vertical" />

        <Button
          type="primary"
          icon={<PrinterOutlined />}
          size="middle"
          onClick={() =>
            window.open(
              getUrlPrefix() +
                "/reports/payroll/print/payrollLedgerDownload?id=" +
                router?.query?.id
            )
          }
        >
          DownLoad Payroll Per Register
        </Button>

        <Divider type="vertical" />
      </div>

      <Row>
        <div
          style={{
            width: "100%",
            height: "100%",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          <Table
            loading={loading}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            rowKey="id"
            columns={columns}
            dataSource={data || []}
          />
        </div>
      </Row>
    </div>
  );
}

export default PayslipSearchForm;
