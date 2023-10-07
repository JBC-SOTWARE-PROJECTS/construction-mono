import { HoursLog } from "@/graphql/gql/graphql";
import { CSSProperties } from "@ant-design/cssinjs/lib/hooks/useStyleRegister";
import { Table } from "antd";
import { round } from "lodash";
import React from "react";

function ProjectBreakdownTable({ dataSource }: any) {
  const render = (value: any) => {
    return value && round(value, 4);
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
    },
    {
      title: "Regular",
      dataIndex: "regular",
      key: "regular",
      children: [
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
      columns={columns}
      dataSource={dataSource as HoursLog[]}
    />
  );
}

export default ProjectBreakdownTable;
