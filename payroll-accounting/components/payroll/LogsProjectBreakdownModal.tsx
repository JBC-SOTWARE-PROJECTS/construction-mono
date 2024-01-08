import {
  AccumulatedLogs,
  EmployeeSalaryDto,
  HoursLog,
} from "@/graphql/gql/graphql";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Descriptions, Modal, Radio, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import CustomButton from "../common/CustomButton";
import ProjectBreakdownTable from "./ProjectBreakdownTable";

interface IProps {
  record: AccumulatedLogs;
  salaryBreakdown?: EmployeeSalaryDto[];
  disabled: boolean;
  children?: any;
}
const { Text, Title } = Typography;
function LogsProjectBreakdownModal({
  record,
  disabled,
  salaryBreakdown,
  ...props
}: IProps) {
  const [visible, setVisible] = useState(false);
  const [toggleValue, setToggleValue] = useState<string>("hours");

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

        {salaryBreakdown && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
            <Radio.Group
              buttonStyle="solid"
              onChange={(e) => setToggleValue(e.target.value)}
              value={toggleValue}
            >
              <Radio.Button value={"hours"}>Hours Breakdown</Radio.Button>
              <Radio.Button value={"salary"}>Salary Breakdown</Radio.Button>
            </Radio.Group>
          </div>
        )}
        <ProjectBreakdownTable
          dataSource={
            toggleValue == "hours"
              ? (record?.projectBreakdown as HoursLog[])
              : salaryBreakdown
          }
          toggleValue={toggleValue}
        />
      </Modal>
    </>
  );
}

export default LogsProjectBreakdownModal;
