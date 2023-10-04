import { FormDateRange } from "@/components/common";
import CustomButton from "@/components/common/CustomButton";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Row, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import UpsertAttendanceModal from "./UpsertAttendanceModal";
import useGetEmployeeAttendance from "@/hooks/attendance/useGetEmployeeAttendance";
import { useRouter } from "next/router";
import { ColumnsType } from "antd/es/table";
import { EmployeeAttendance } from "@/graphql/gql/graphql";
import usePaginationState from "@/hooks/usePaginationState";
import useDateRangeState from "@/hooks/useDateRangeState";
import useIgnoreAttendance from "@/hooks/attendance/useIgnoreAttendance";
import { useGetEmployeeById } from "@/hooks/employee";
interface IProps {
  id?: string;
  useStaticData?: boolean;
  startDateStatic?: dayjs.Dayjs;
  endDateStatic?: dayjs.Dayjs;
  callback?: () => void;
  hideAddButton?: boolean;
}

function RawLogs({
  id,
  useStaticData,
  startDateStatic,
  endDateStatic,
  callback,
  hideAddButton = false,
}: IProps) {
  const [_, { onNextPage }] = usePaginationState({}, 0, 25);

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [startDate, endDate, handleDateChange] = useDateRangeState();
  const [getAttendance, data, loading, refetch] = useGetEmployeeAttendance();
  const [ignoreAttendance, loadingIgnore] = useIgnoreAttendance(() => {
    refetch();
    if (callback) callback();
  });

  const [record, setRecord] = useState<EmployeeAttendance>();
  const handleEdit = (record: EmployeeAttendance) => {
    setRecord(record);
    setOpen(true);
  };

  const columns: ColumnsType<EmployeeAttendance> = [
    {
      title: "Date Time",
      dataIndex: "attendance_time",
      key: "attendance_time",
      render: (
        value,
        {
          isManual,
          isIgnored,
          type,
          originalType,
          attendance_time,
          original_attendance_time,
        }
      ) => {
        return (
          <>
            {dayjs(value).format("ddd, MMM DD, YYYY hh:mm a ")}{" "}
            {isManual && <Tag color="blue">MANUAL</Tag>}
            {isIgnored && <Tag color="red">IGNORED</Tag>}
            {(type !== originalType ||
              attendance_time !== original_attendance_time) &&
              !isManual && <Tag color="green">EDITED</Tag>}
          </>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Project",
      dataIndex: ["project", "description"],
      key: "project",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (value, record) => {
        return (
          !hideAddButton && (
            <Space>
              <CustomButton
                tooltip="edit"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />

              <CustomButton
                tooltip={record?.isIgnored ? "Undo Ignore" : "Ignore"}
                danger={!record?.isIgnored}
                type="primary"
                ghost
                icon={
                  record?.isIgnored ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                onClick={() => ignoreAttendance(record?.id as string)}
              />
            </Space>
          )
        );
      },
    },
  ];

  const toggleModal = () => {
    if (open) setRecord({});
    setOpen(!open);
  };

  useEffect(() => {
    if (useStaticData && id) {
      getAttendance({
        id: id,
        size: 10,
        page: 0,
        startDate: startDateStatic?.startOf("day"),
        endDate: endDateStatic?.endOf("day"),
      });
    }
  }, [startDateStatic]);
  const [employee, loadingEmployee] = useGetEmployeeById(router?.query?.id);
  return (
    <>
      {!useStaticData && (
        <table>
          <tr>
            <td>Name:</td>
            <td style={{ paddingLeft: 10, fontWeight: "bold" }}>
              {employee?.fullName}
            </td>
          </tr>
          <tr>
            <td>Position:</td>
            <td style={{ paddingLeft: 10, fontWeight: "bold" }}>
              {employee?.position?.description}
            </td>
          </tr>
        </table>
      )}
      {(!useStaticData || !hideAddButton) && (
        <>
          {" "}
          <Divider />
          <Row gutter={16}>
            <Col span={12}>
              {!useStaticData && (
                <FormDateRange
                  name="dateRange"
                  label="Date Range"
                  propsrangepicker={{
                    format: "MMMM D, YYYY",
                    use12Hours: true,
                    onChange: (dates: any) => {
                      handleDateChange(dates);
                    },
                  }}
                />
              )}
            </Col>

            <Col span={4}>
              {!useStaticData && (
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    getAttendance({
                      id: router?.query?.id || id,
                      size: 10,
                      page: 0,
                      startDate: startDate?.startOf("day"),
                      endDate: endDate?.endOf("day"),
                    });
                  }}
                >
                  Search
                </Button>
              )}
            </Col>

            {!hideAddButton && (
              <Col span={8}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <CustomButton
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setOpen(true)}
                  >
                    Add Raw Log
                  </CustomButton>
                </div>
              </Col>
            )}
          </Row>
          <Divider />
        </>
      )}
      <Table
        dataSource={data?.content}
        size="small"
        columns={columns}
        onChange={onNextPage}
        loading={loading || loadingIgnore}
      />
      {open && (
        <UpsertAttendanceModal
          open={open}
          toggleModal={toggleModal}
          record={record}
          callback={() => {
            if (callback) callback();
            refetch();
          }}
        />
      )}
    </>
  );
}

export default RawLogs;
