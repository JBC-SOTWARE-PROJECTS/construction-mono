import {
  AccumulatedLogs,
  HoursLog,
  TimekeepingEmployeeDto,
} from "@/graphql/gql/graphql";
import useRecalculateOneLog from "@/hooks/payroll/timekeeping/useRecalculateOneLog";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Col, Modal, Row, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { round } from "lodash";
import { useRouter } from "next/router";
import { CSSProperties, useState } from "react";
import CustomButton from "../common/CustomButton";
import LogsProjectBreakdownModal from "./LogsProjectBreakdownModal";
import RawLogs from "./employee-management/attendance/RawLogs";

interface IProps {
  dataSource: AccumulatedLogs[];
  loading: boolean;
  refetch?: () => void;
  showBreakdown?: boolean;
  isTimekeeping?: boolean;
  displayedEmployee?: TimekeepingEmployeeDto;
}

function AccumulatedLogsTable({
  dataSource,
  loading,
  refetch,
  showBreakdown = false,
  isTimekeeping = false,
  displayedEmployee,
}: IProps) {
  const [calculate, loadingRecalculate] = useRecalculateOneLog(refetch);
  const [openRawLogs, setOpenRawLogs] = useState<boolean>(false);
  const [rawLogsdata, setRawLogsData] = useState<any>(null);
  const [shouldRecalculate, setShouldRecalculate] = useState(false);
  const router = useRouter();

  const onCellProps = (record: AccumulatedLogs, key: keyof HoursLog) => {
    const hours = record?.hours?.[key] || 0;
    var style: CSSProperties = { textAlign: "center" };
    if (hours > 0)
      style = { ...style, backgroundColor: "#d7fada", color: "#2c8a34" };
    return { style };
  };
  console.log(displayedEmployee?.status === "FINALIZED");
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
      width: 110,
      render: (value: any) => (value ? dayjs(value).format("hh:mm a") : "-"),
    },
    {
      title: "Time Out",
      dataIndex: "outTime",
      key: "outTime",
      width: 110,
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
          width: 110,
          onCell: (record: AccumulatedLogs) =>
            underPerformanceCell(record, "late"),
          render: render,
        },
        {
          title: "Undertime",
          dataIndex: ["hours", "underTime"],
          key: "underTime",
          width: 110,

          onCell: (record: AccumulatedLogs) =>
            underPerformanceCell(record, "underTime"),
          render: render,
        },
        {
          title: "Absent",
          dataIndex: ["hours", "absent"],
          key: "absent",
          width: 110,

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
          width: 110,
          onCell: (record: AccumulatedLogs) => onCellProps(record, "regular"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtime"],
          key: "overtime",
          width: 110,
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
          width: 110,
          onCell: (record: AccumulatedLogs) =>
            onCellProps(record, "regularHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeHoliday"],
          key: "overtimeHoliday",
          width: 110,
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
          width: 110,
          onCell: (record: AccumulatedLogs) =>
            onCellProps(record, "regularSpecialHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeSpecialHoliday"],
          key: "overtimeSpecialHoliday",
          width: 110,
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
          width: 110,
          onCell: (record: AccumulatedLogs) =>
            onCellProps(record, "regularDoubleHoliday"),
          render: render,
        },

        {
          title: "Overtime",
          dataIndex: ["hours", "overtimeDoubleHoliday"],
          key: "overtimeDoubleHoliday",
          width: 110,
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
      width: 145,
      render: (id: string, record: AccumulatedLogs) => {
        return (
          <Space>
            {showBreakdown && (
              <LogsProjectBreakdownModal
                render={render}
                record={record}
                disabled={record?.isError || false}
              />
            )}
            <CustomButton
              id={id}
              tooltip="View Raw Logs"
              shape="circle"
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setRawLogsData({
                  startDate: dayjs(record.date).startOf("day"),
                  endDate: dayjs(record.date).endOf("day"),
                  employeeId: record.employeeId || router?.query?.id,
                  logId: record.id,
                });
                setOpenRawLogs(true);
              }}
              // allowedPermissions={["recalculate_one_timekeeping_employee"]}
            />
            {isTimekeeping && displayedEmployee?.status === "DRAFT" && (
              <>
                <CustomButton
                  id={id}
                  tooltip="Recalculate"
                  shape="circle"
                  type="primary"
                  icon={<ReloadOutlined />}
                  danger
                  onClick={() => confirmRecalculate(record)}
                  // allowedPermissions={["recalculate_one_timekeeping_employee"]}
                />
              </>
            )}
          </Space>
        );
      },
    },
  ];
  const scrollProps = { y: "calc(100vh - 330px)" };

  const handleCloseAttendanceLogs = () => {
    setOpenRawLogs(false);
    if (shouldRecalculate) {
      calculate({
        id: rawLogsdata?.logId,
        startDate: dayjs(rawLogsdata?.startDate).startOf("day"),
        endDate: dayjs(rawLogsdata?.endDate).endOf("day"),
        employeeId: rawLogsdata?.employeeId,
      });
      setShouldRecalculate(false);
    }
  };
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
        summary={(pageData: readonly AccumulatedLogs[]) => {
          let obj: any = {};
          const keys = [
            "late",
            "underTime",
            "absent",
            "regular",
            "overtime",
            "regularHoliday",
            "overtimeHoliday",
            "regularSpecialHoliday",
            "overtimeSpecialHoliday",
            "regularDoubleHoliday",
            "overtimeDoubleHoliday",
          ];
          pageData.forEach((item: AccumulatedLogs) => {
            keys.forEach((key) => {
              obj[key] =
                (item?.hours ? item?.hours[key as keyof HoursLog] : 0) +
                (obj[key] ? obj[key] : 0);
            });
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell key={99} index={99} colSpan={3}>
                  <b>Totals</b>
                </Table.Summary.Cell>
                {keys.map((item: string, index) => {
                  return (
                    <Table.Summary.Cell key={item} index={index}>
                      <div
                        style={{
                          textAlign: "center",

                          ...(obj[item] > 0
                            ? {
                                // backgroundColor: "#d7fada",
                                color: ["late", "underTime", "absent"].includes(
                                  item
                                )
                                  ? "red"
                                  : "green",
                              }
                            : {}),
                        }}
                      >
                        {round(isNaN(obj[item]) ? 0 : obj[item], 4)}
                      </div>
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
            </>
          );
        }}
      />

      <Modal
        title="Raw Attendance Logs"
        open={openRawLogs}
        onCancel={handleCloseAttendanceLogs}
        onOk={handleCloseAttendanceLogs}
        width="70vw"
      >
        <RawLogs
          id={rawLogsdata?.employeeId}
          startDateStatic={rawLogsdata?.startDate}
          endDateStatic={rawLogsdata?.endDate}
          useStaticData
          hideAddButton={displayedEmployee?.status === "FINALIZED"}
          callback={() => setShouldRecalculate(true)}
        />
      </Modal>
    </>
  );
}

export default AccumulatedLogsTable;
