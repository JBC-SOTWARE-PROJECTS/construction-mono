import { AccumulatedLogs, HoursLog } from "@/graphql/gql/graphql";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Descriptions, Modal, Table, Typography } from "antd";
import dayjs from "dayjs";
import CustomButton from "../common/CustomButton";
import { useState } from "react";
import { CSSProperties } from "@ant-design/cssinjs/lib/hooks/useStyleRegister";
import { DateFormatterWithTime } from "@/utility/helper";
import ProjectBreakdownTable from "./ProjectBreakdownTable";

interface IProps {
  record: AccumulatedLogs;
  disabled: boolean;
  children?: any;
}
const { Text, Title } = Typography;
function LogsProjectBreakdownModal({ record, disabled, ...props }: IProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <CustomButton
        tooltip="View Project Breakdown"
        icon={<UnorderedListOutlined />}
        shape={!props?.children ? "circle" : "default"}
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
        disabled={disabled}
      >
        {props?.children}
      </CustomButton>

      <Modal
        title="Project Breakdown"
        open={visible}
        onCancel={() => setVisible(false)}
        width={"80vw"}
      >
        {record?.date && (
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
        )}

        <ProjectBreakdownTable
          dataSource={record?.projectBreakdown as HoursLog[]}
        />
      </Modal>
    </>
  );
}

export default LogsProjectBreakdownModal;
