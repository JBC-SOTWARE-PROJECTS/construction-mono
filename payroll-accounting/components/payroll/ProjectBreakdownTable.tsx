import { EmployeeSalaryDto, HoursLog } from "@/graphql/gql/graphql";
import NumeralFormatter from "@/utility/numeral-formatter";
import { CSSProperties } from "@ant-design/cssinjs/lib/hooks/useStyleRegister";
import { Table } from "antd";
import { round } from "lodash";
import React from "react";

function ProjectBreakdownTable({ dataSource, toggleValue, size }: any) {
  const render = (value: any) => {
    if (toggleValue == "hours") return value && round(value, 4);
    else if (toggleValue == "salary") return <NumeralFormatter value={value} />;
  };
  const onCellProps = (record: HoursLog, key: keyof HoursLog) => {
    const hours = record?.[key] || 0;
    var style: CSSProperties = { textAlign: "center" };
    if (hours > 0)
      style = { ...style, backgroundColor: "#d7fada", color: "#2c8a34" };
    return { style };
  };

  const columns = [
    {
      title: "Project",
      dataIndex: "projectName",
      render: (value: any, record: EmployeeSalaryDto) => {
        return value ? value : `Charge to ${record?.companyName}`;
      },
    },
    {
      title: "Regular",
      key: "regular",
      children: [
        {
          title: "Late",
          dataIndex: "late",
          key: "late",

          onCell: (record: any) => onCellProps(record, "late"),
          render: render,
        },

        {
          title: "Regular",
          dataIndex: "regular",
          key: "regular",

          onCell: (record: any) => onCellProps(record, "regular"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: "overtime",
          key: "overtime",

          onCell: (record: any) => onCellProps(record, "overtime"),
          render: render,
        },
      ],
    },
    {
      title: "Regular Holiday",
      dataIndex: "regularHoliday",
      key: "regularHoliday",
      children: [
        {
          title: "Regular",
          dataIndex: "regularHoliday",
          key: "regularHoliday",

          onCell: (record: any) => onCellProps(record, "regularHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: "overtimeHoliday",
          key: "overtimeHoliday",

          onCell: (record: any) => onCellProps(record, "overtimeHoliday"),
          render: render,
        },
      ],
    },
    {
      title: "Special Non-working Holiday",
      dataIndex: "specialHoliday",
      key: "specialHoliday",
      children: [
        {
          title: "Regular",
          dataIndex: "regularSpecialHoliday",
          key: "regularSpecialHoliday",

          onCell: (record: any) => onCellProps(record, "regularSpecialHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: "overtimeSpecialHoliday",
          key: "overtimeSpecialHoliday",

          onCell: (record: any) =>
            onCellProps(record, "overtimeSpecialHoliday"),
          render: render,
        },
      ],
    },
    {
      title: "Double Holiday",
      dataIndex: "doubleHoliday",
      key: "doubleHoliday",
      children: [
        {
          title: "Regular",
          dataIndex: "regularDoubleHoliday",
          key: "regularDoubleHoliday",

          onCell: (record: any) => onCellProps(record, "regularDoubleHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: "overtimeDoubleHoliday",
          key: "overtimeDoubleHoliday",

          onCell: (record: any) => onCellProps(record, "overtimeDoubleHoliday"),
          render: render,
        },
      ],
    },
  ];
  return (
    <Table
      onHeaderRow={() => ({ style: { textAlignLast: "center" } })}
      columns={columns as any}
      size={size}
      dataSource={dataSource as HoursLog[]}
    />
  );
}

export default ProjectBreakdownTable;
