import { AccumulatedLogsDto, HoursLog } from "@/graphql/gql/graphql";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Col, Row, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { CSSProperties, useState } from "react";
interface IProps {
  dataSource: AccumulatedLogsDto[];
  loading: boolean;
}

function AccumulatedLogsTable({ dataSource, loading }: IProps) {
  const onCellProps = (record: AccumulatedLogsDto, key: keyof HoursLog) => {
    const hours = record?.hours?.[key] || 0;
    var style: CSSProperties = { textAlign: "center" };
    if (hours > 0)
      style = { ...style, backgroundColor: "#d7fada", color: "#2c8a34" };
    return { style };
  };

  const underPerformanceCell = (
    record: AccumulatedLogsDto,
    key: keyof HoursLog
  ) => {
    const hours = record?.hours?.[key] || 0;
    var style: CSSProperties = { textAlign: "center" };
    if (hours > 0)
      style = { ...style, backgroundColor: "#f7e9e9", color: "#db3939" };
    return { style };
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (value: any, record: any) => (
        <Row>
          <Col span={16}>
            {!record.isError ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )}{" "}
            {dayjs(value).format("ddd, MMM DD, YYYY  ")}
          </Col>
          <Col span={8}>
            {record?.message && (
              <Tag color={record.isError ? "red" : "blue"}>
                {record?.message}
              </Tag>
            )}
          </Col>
        </Row>
      ),
    },
    {
      title: "Time in",
      dataIndex: "inTime",
      key: "inTime",
      render: (value: any) => (value ? dayjs(value).format("hh:mm a") : "-"),
    },
    {
      title: "Time Out",
      dataIndex: "outTime",
      key: "outTime",
      render: (value: any) => (value ? dayjs(value).format("hh:mm a") : "-"),
    },
    {
      title: "Under Performances",
      key: "hours",
      dataIndex: "hours",
      children: [
        {
          title: "Late",
          dataIndex: ["hours", "late"],
          key: "late",
          width: 100,
          onCell: (record: any) => underPerformanceCell(record, "late"),
        },
        {
          title: "Undertime",
          dataIndex: ["hours", "underTime"],
          key: "underTime",
          width: 100,
          onCell: (record: any) => underPerformanceCell(record, "underTime"),
        },
        {
          title: "Absent",
          dataIndex: ["hours", "absent"],
          key: "absent",
          width: 100,
          onCell: (record: any) => underPerformanceCell(record, "absent"),
        },
      ],
    },
    {
      title: "Regular",
      dataIndex: "regular",
      key: "regular",
      children: [
        {
          title: "Regular",
          dataIndex: ["hours", "regular"],
          key: "regular",
          width: 100,
          onCell: (record: any) => onCellProps(record, "regular"),
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtime"],
          key: "overtime",
          width: 100,
          onCell: (record: any) => onCellProps(record, "overtime"),
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
          dataIndex: ["hours", "regularHoliday"],
          key: "regularHoliday",
          width: 100,
          onCell: (record: any) => onCellProps(record, "regularHoliday"),
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeHoliday"],
          key: "overtimeHoliday",
          width: 100,
          onCell: (record: any) => onCellProps(record, "overtimeHoliday"),
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
          dataIndex: ["hours", "regularSpecialHoliday"],
          key: "regularSpecialHoliday",
          width: 100,
          onCell: (record: any) => onCellProps(record, "regularSpecialHoliday"),
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeSpecialHoliday"],
          key: "overtimeSpecialHoliday",
          width: 100,
          onCell: (record: any) =>
            onCellProps(record, "overtimeSpecialHoliday"),
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
          dataIndex: ["hours", "regularDoubleHoliday"],
          key: "regularDoubleHoliday",
          width: 100,
          onCell: (record: any) => onCellProps(record, "regularDoubleHoliday"),
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeDoubleHoliday"],
          key: "overtimeDoubleHoliday",
          width: 100,
          onCell: (record: any) => onCellProps(record, "overtimeDoubleHoliday"),
        },
      ],
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        onHeaderRow={() => ({ style: { textAlignLast: "center" } })}
      />
    </>
  );
}

export default AccumulatedLogsTable;
