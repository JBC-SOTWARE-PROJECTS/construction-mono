import {
  AccumulatedLogs,
  HoursLog,
  PayrollModule,
} from "@/graphql/gql/graphql";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Col, Modal, Row, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { round } from "lodash";
import { CSSProperties } from "react";
import CustomButton from "../common/CustomButton";
import LogsProjectBreakdownModal from "./LogsProjectBreakdownModal";
import PayrollModuleRecalculateEmployeeAction from "./payroll-management/PayrollModuleRecalculateEmployeeAction";
import useRecalculateOneLog from "@/hooks/payroll/timekeeping/useRecalculateOneLog";
import { debug } from "console";

interface IProps {
  dataSource: AccumulatedLogs[];
  loading: boolean;
  refetch?: () => void;
  isTimekeeping?: boolean;
  showBreakdown?: boolean;
}

function AccumulatedLogsTable({
  dataSource,
  loading,
  refetch,
  isTimekeeping = false,
  showBreakdown = false,
}: IProps) {
  const [calculate, loadingRecalculate] = useRecalculateOneLog(refetch);

  const onCellProps = (record: AccumulatedLogs, key: keyof HoursLog) => {
    const hours = record?.hours?.[key] || 0;
    var style: CSSProperties = { textAlign: "center" };
    if (hours > 0)
      style = { ...style, backgroundColor: "#d7fada", color: "#2c8a34" };
    return { style };
  };

  const underPerformanceCell = (
    record: AccumulatedLogs,
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

  const confirmRecalculate = (record: AccumulatedLogs) => {
    debugger;
    Modal.confirm({
      title: "Are you sure you want to recalculate this date?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        calculate({
          id: record.id,
          startDate: dayjs(record.date).startOf("day"),
          endDate: dayjs(record.date).endOf("day"),
          employeeId: record.employeeId,
        });
      },
      onCancel() {},
    });
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 250,
      render: (value: any, record: AccumulatedLogs) => (
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

          onCell: (record: AccumulatedLogs) =>
            underPerformanceCell(record, "late"),
          render: render,
        },
        {
          title: "Undertime",
          dataIndex: ["hours", "underTime"],
          key: "underTime",

          onCell: (record: AccumulatedLogs) =>
            underPerformanceCell(record, "underTime"),
          render: render,
        },
        {
          title: "Absent",
          dataIndex: ["hours", "absent"],
          key: "absent",

          onCell: (record: AccumulatedLogs) =>
            underPerformanceCell(record, "absent"),
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

          onCell: (record: AccumulatedLogs) => onCellProps(record, "regular"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtime"],
          key: "overtime",

          onCell: (record: AccumulatedLogs) => onCellProps(record, "overtime"),
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

          onCell: (record: AccumulatedLogs) =>
            onCellProps(record, "regularHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeHoliday"],
          key: "overtimeHoliday",

          onCell: (record: AccumulatedLogs) =>
            onCellProps(record, "overtimeHoliday"),
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

          onCell: (record: AccumulatedLogs) =>
            onCellProps(record, "regularSpecialHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeSpecialHoliday"],
          key: "overtimeSpecialHoliday",

          onCell: (record: AccumulatedLogs) =>
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

          onCell: (record: AccumulatedLogs) =>
            onCellProps(record, "regularDoubleHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeDoubleHoliday"],
          key: "overtimeDoubleHoliday",

          onCell: (record: AccumulatedLogs) =>
            onCellProps(record, "overtimeDoubleHoliday"),
          render: render,
        },
      ],
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (id: string, record: AccumulatedLogs) => {
        return (
          <Space>
            {showBreakdown && (
              <LogsProjectBreakdownModal render={render} record={record} />
            )}

            {isTimekeeping && (
              <CustomButton
                id={id}
                tooltip="Recalculate This Date"
                shape="circle"
                type="primary"
                icon={<ReloadOutlined />}
                danger
                onClick={() => confirmRecalculate(record)}
                // allowedPermissions={["recalculate_one_timekeeping_employee"]}
              />
            )}
          </Space>
        );
      },
    },
  ];
  const scrollProps = { y: "calc(100vh - 330px)" };
  return (
    <>
      <Table
        pagination={false}
        className="ant-table-body"
        columns={columns}
        dataSource={dataSource}
        bordered
        scroll={scrollProps}
        onHeaderRow={() => ({ style: { textAlignLast: "center" } })}
        loading={loading || loadingRecalculate}
      />
    </>
  );
}

export default AccumulatedLogsTable;
