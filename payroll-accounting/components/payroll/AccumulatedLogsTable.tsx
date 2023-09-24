import { AccumulatedLogsDto, HoursLog } from "@/graphql/gql/graphql";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Col, Row, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { round } from "lodash";
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

  const render = (value: any) => {
    return value && round(value, 4);
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 250,
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
      width: 90,
      render: (value: any) => (value ? dayjs(value).format("hh:mm a") : "-"),
    },
    {
      title: "Time Out",
      dataIndex: "outTime",
      width: 90,
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
          width: 87,
          onCell: (record: any) => underPerformanceCell(record, "late"),
          render: render,
        },
        {
          title: "Undertime",
          dataIndex: ["hours", "underTime"],
          key: "underTime",
          width: 87,
          onCell: (record: any) => underPerformanceCell(record, "underTime"),
          render: render,
        },
        {
          title: "Absent",
          dataIndex: ["hours", "absent"],
          key: "absent",
          width: 87,
          onCell: (record: any) => underPerformanceCell(record, "absent"),
          render: render,
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
          width: 87,
          onCell: (record: any) => onCellProps(record, "regular"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtime"],
          key: "overtime",
          width: 87,
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
          dataIndex: ["hours", "regularHoliday"],
          key: "regularHoliday",
          width: 87,
          onCell: (record: any) => onCellProps(record, "regularHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeHoliday"],
          key: "overtimeHoliday",
          width: 87,
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
          dataIndex: ["hours", "regularSpecialHoliday"],
          key: "regularSpecialHoliday",
          width: 87,
          onCell: (record: any) => onCellProps(record, "regularSpecialHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeSpecialHoliday"],
          key: "overtimeSpecialHoliday",
          width: 87,
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
          dataIndex: ["hours", "regularDoubleHoliday"],
          key: "regularDoubleHoliday",
          width: 87,
          onCell: (record: any) => onCellProps(record, "regularDoubleHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeDoubleHoliday"],
          key: "overtimeDoubleHoliday",
          width: 87,
          onCell: (record: any) => onCellProps(record, "overtimeDoubleHoliday"),
          render: render,
        },
      ],
    },
  ];
  const scrollProps = { y: "calc(100vh - 330px)" };
  return (
    <>
      <Table
        className="ant-table-body"
        columns={columns}
        dataSource={dataSource}
        bordered
        scroll={scrollProps}
        onHeaderRow={() => ({ style: { textAlignLast: "center" } })}
      />
    </>
  );
}

export default AccumulatedLogsTable;
