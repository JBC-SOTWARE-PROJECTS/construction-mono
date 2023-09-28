import { AccumulatedLogs, HoursLog } from "@/graphql/gql/graphql";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Descriptions, Modal, Table, Typography } from "antd";
import dayjs from "dayjs";
import CustomButton from "../common/CustomButton";
import { useState } from "react";
import { CSSProperties } from "@ant-design/cssinjs/lib/hooks/useStyleRegister";
import { DateFormatterWithTime } from "@/utility/helper";

interface IProps {
  record: AccumulatedLogs;
  render: any;
}
const { Text, Title } = Typography;
function LogsProjectBreakdownModal({ record, render }: IProps) {
  const [visible, setVisible] = useState(false);

  const onCellProps = (record: HoursLog, key: keyof HoursLog) => {
    const hours = record?.[key] || 0;
    var style: CSSProperties = { textAlign: "center" };
    if (hours > 0)
      style = { ...style, backgroundColor: "#d7fada", color: "#2c8a34" };
    return { style };
  };

  const columns = [
    // {
    //   title: "Time in",
    //   dataIndex: "inTime",
    //   key: "inTime",
    //   render: (value: any) => (value ? dayjs(value).format("hh:mm a") : "-"),
    // },
    // {
    //   title: "Time Out",
    //   dataIndex: "outTime",
    //   key: "outTime",
    //   render: (value: any) => (value ? dayjs(value).format("hh:mm a") : "-"),
    // },
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
    <>
      <CustomButton
        tooltip="View Project Breakdown"
        icon={<UnorderedListOutlined />}
        shape="circle"
        onClick={() => {
          setVisible(true);
        }}
      />

      <Modal
        title="Project Breakdown"
        open={visible}
        onCancel={() => setVisible(false)}
        width={"80vw"}
      >
        <Descriptions>
          <Descriptions.Item label="Date">
            {dayjs(record?.date).format("ddd, MMM DD, YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Schedule Start">
            {dayjs(record?.scheduleStart).format("hh:mm a")}
          </Descriptions.Item>
          <Descriptions.Item label="Schedule End">
            {dayjs(record?.scheduleEnd).format("hh:mm a")}
          </Descriptions.Item>
          <Descriptions.Item label="Schedule Title">
            {record?.scheduleTitle}
          </Descriptions.Item>
          <Descriptions.Item label="In Time">
            {dayjs(record?.inTime).format("hh:mm a")}
          </Descriptions.Item>
          <Descriptions.Item label="Out Time">
            {dayjs(record?.outTime).format("hh:mm a")}
          </Descriptions.Item>
        </Descriptions>
        <Table
          onHeaderRow={() => ({ style: { textAlignLast: "center" } })}
          columns={columns}
          dataSource={record?.projectBreakdown as HoursLog[]}
        />
      </Modal>
    </>
  );
}

export default LogsProjectBreakdownModal;
