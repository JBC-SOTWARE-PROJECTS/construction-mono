import { FormDateRange } from "@/components/common";
import CustomButton from "@/components/common/CustomButton";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Row, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import UpsertAttendanceModal from "./UpsertAttendanceModal";
import useGetEmployeeAttendance from "@/hooks/attendance/useGetEmployeeAttendance";
import { useRouter } from "next/router";
import { ColumnsType } from "antd/es/table";
import { EmployeeAttendance } from "@/graphql/gql/graphql";
import usePaginationState from "@/hooks/usePaginationState";

function RawLogs() {
  const [_, { onNextPage }] = usePaginationState({}, 0, 25);
  const [dates, setDates] = useState<dayjs.Dayjs[] | null[]>([null, null]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [getEmployeeSchedule, data, loading] = useGetEmployeeAttendance();

  const handleDateChange = (dates: any) => {
    try {
      setDates([dayjs(dates[0]).startOf("day"), dayjs(dates[1]).endOf("day")]);
    } catch {
      setDates([dayjs().startOf("month"), dayjs().endOf("month")]);
    }
  };

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
      render: (value, record) => {
        return (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
        );
      },
    },
  ];

  const toggleModal = () => {
    if (open) setRecord({});
    setOpen(!open);
  };
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
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
        </Col>

        <Col span={4}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              getEmployeeSchedule({
                id: router?.query?.id,
                size: 10,
                page: 0,
                startDate: dates[0]?.startOf("day"),
                endDate: dates[1]?.endOf("day"),
              });
            }}
          >
            Search
          </Button>
        </Col>

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
      </Row>
      <Divider />
      <Table
        dataSource={data?.content}
        size="small"
        columns={columns}
        onChange={onNextPage}
        loading={loading}
      />
      {open && (
        <UpsertAttendanceModal
          open={open}
          toggleModal={toggleModal}
          record={record}
        />
      )}
    </>
  );
}

export default RawLogs;
