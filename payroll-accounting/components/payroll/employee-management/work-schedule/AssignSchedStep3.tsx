import EmployeeTable from "@/components/administrative/employees/EmployeeTable";
import ScheduleCard from "@/components/common/ScheduleCard";
import { Employee, Schedule } from "@/graphql/gql/graphql";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import { Card, Col, Row, Table } from "antd";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import dayjs from "dayjs";
import {
  OvertimeDetails,
  columns,
  transformDatesArray,
} from "./AssignEmployeeScheduleModal";

interface IProps {
  selectedDates: string[];
  handleSelectDate: (e: dayjs.Dayjs, selectedInfo: SelectInfo) => void;
  scheduleType: Schedule | null;
  selectedEmployees: Employee[];
  overtimeDetails?: OvertimeDetails;
  mode: string;
}

function AssignSchedStep3({
  selectedDates,
  handleSelectDate,
  scheduleType,
  selectedEmployees,
  overtimeDetails,
  mode,
}: IProps) {
  const formattedDates = transformDatesArray(selectedDates);

  return (
    <div>
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        headerBordered
        extra={<ProFormGroup></ProFormGroup>}>
        <Row gutter={16}>
          <Col span={12}>
            <ScheduleCard
              scheduleType={scheduleType}
              overtimeDetails={overtimeDetails}
              mode={mode}
            />
          </Col>
          <Col span={12}>
            <Card
              title="Selected Dates"
              // bodyStyle={}
              styles={{
                body: { padding: 5 },
              }}
              bordered={false}>
              <Table
                size="small"
                columns={columns}
                dataSource={transformDatesArray(selectedDates)}
              />
            </Card>
          </Col>

          <Col span={24} style={{ marginTop: 30 }}>
            <Card
              title="Selected Employees"
              // bodyStyle={}
              styles={{
                body: { padding: 5 },
              }}
              bordered={false}>
              <EmployeeTable
                dataSource={selectedEmployees as Employee[]}
                hideExtraColumns
              />
            </Card>
          </Col>
        </Row>
      </ProCard>
    </div>
  );
}

export default AssignSchedStep3;
