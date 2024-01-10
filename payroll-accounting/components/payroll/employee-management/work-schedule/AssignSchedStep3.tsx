import EmployeeTable from "@/components/administrative/employees/EmployeeTable";
import { Employee, Schedule } from "@/graphql/gql/graphql";
import { getTimeFromDate } from "@/utility/helper";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import { Card, Col, Empty, Row, Table, Tag } from "antd";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { columns, transformDatesArray } from "./AssignEmployeeScheduleModal";
import ScheduleCard from "@/components/common/ScheduleCard";

interface IProps {
  selectedDates: string[];
  handleSelectDate: (e: dayjs.Dayjs, selectedInfo: SelectInfo) => void;
  scheduleType: Schedule | null;
  selectedEmployees: Employee[];
}

function AssignSchedStep3({
  selectedDates,
  handleSelectDate,
  scheduleType,
  selectedEmployees,
}: IProps) {
  const formattedDates = transformDatesArray(selectedDates);

  return (
    <div>
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        headerBordered
        extra={<ProFormGroup></ProFormGroup>}
      >
        <Row gutter={16}>
          <Col span={10}>
            <ScheduleCard scheduleType={scheduleType} />
          </Col>
          <Col span={14}>
            <Card
              title="Selected Dates"
              bodyStyle={{ padding: 5 }}
              bordered={false}
            >
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
              bodyStyle={{ padding: 5 }}
              bordered={false}
            >
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
